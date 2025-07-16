import { useState, useEffect, useCallback, useRef } from 'react';

interface FormLockOptions {
  formId: string;
  userId: string;
  userName: string;
  onLockAcquired?: () => void;
  onLockFailed?: (lockedBy: string) => void;
  onLockReleased?: () => void;
  refreshInterval?: number;
}

interface LockStatus {
  isLocked: boolean;
  lockedBy: string | null;
  lockHash: string | null;
  canTakeover: boolean;
  loading: boolean;
  error: Error | null;
}

interface LockCheckResponse {
  locked: boolean;
  lockedBy?: string;
  lastActivity?: string;
  isStale?: boolean;
  canTakeover?: boolean;
  error?: string;
}

interface LockAcquireResponse {
  success?: boolean;
  lockHash?: string;
  message?: string;
  error?: string;
  lockedBy?: string;
  canTakeover?: boolean;
}

export function useFormLock({
  formId,
  userId,
  userName,
  onLockAcquired,
  onLockFailed,
  onLockReleased,
  refreshInterval = 60000 // Refresh lock every minute
}: FormLockOptions) {
  const [status, setStatus] = useState<LockStatus>({
    isLocked: false,
    lockedBy: null,
    lockHash: null,
    canTakeover: false,
    loading: true,
    error: null
  });
  
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockHashRef = useRef<string | null>(null);
  
  // Check lock status
  const checkLockStatus = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`/api/form-locks?formId=${formId}`);
      const data: LockCheckResponse = await response.json();
      
      if (response.ok) {
        setStatus(prev => ({
          ...prev,
          isLocked: data.locked,
          lockedBy: data.lockedBy || null,
          canTakeover: data.canTakeover || false,
          loading: false,
          error: null
        }));
        return data.locked;
      } else {
        throw new Error(data.error || 'Failed to check lock status');
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }));
      return false;
    }
  }, [formId]);
  
  // Acquire lock
  const acquireLock = useCallback(async (forceTakeover = false) => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch('/api/form-locks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          userId,
          userName,
          forceTakeover
        })
      });
      
      const data: LockAcquireResponse = await response.json();
      
      if (response.ok && data.lockHash) {
        lockHashRef.current = data.lockHash;
        setStatus({
          isLocked: true,
          lockedBy: userName,
          lockHash: data.lockHash,
          canTakeover: false,
          loading: false,
          error: null
        });
        
        onLockAcquired?.();
        
        // Start refresh timer
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
        refreshTimerRef.current = setInterval(() => {
          refreshLock();
        }, refreshInterval);
        
      } else if (response.status === 423) {
        // Form is locked by someone else
        setStatus({
          isLocked: true,
          lockedBy: data.lockedBy || 'Unknown user',
          lockHash: null,
          canTakeover: data.canTakeover || false,
          loading: false,
          error: null
        });
        
        onLockFailed?.(data.lockedBy || 'Unknown user');
      } else {
        throw new Error(data.error || 'Failed to acquire lock');
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }));
    }
  }, [formId, userId, userName, onLockAcquired, onLockFailed, refreshInterval]);
  
  // Refresh lock (extend timeout)
  const refreshLock = useCallback(async () => {
    if (!lockHashRef.current) return;
    
    try {
      await fetch('/api/form-locks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          userId,
          userName,
          forceTakeover: false
        })
      });
    } catch (error) {
      console.error('Failed to refresh lock:', error);
    }
  }, [formId, userId, userName]);
  
  // Release lock
  const releaseLock = useCallback(async () => {
    if (!lockHashRef.current) return;
    
    try {
      const response = await fetch('/api/form-locks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          lockHash: lockHashRef.current
        })
      });
      
      if (response.ok) {
        lockHashRef.current = null;
        setStatus({
          isLocked: false,
          lockedBy: null,
          lockHash: null,
          canTakeover: false,
          loading: false,
          error: null
        });
        
        onLockReleased?.();
        
        // Clear refresh timer
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
          refreshTimerRef.current = null;
        }
      }
    } catch (error) {
      console.error('Failed to release lock:', error);
    }
  }, [formId, onLockReleased]);
  
  // Initial lock check and acquisition
  useEffect(() => {
    const initializeLock = async () => {
      // Check if form is locked
      const isLocked = await checkLockStatus();
      // Automatically try to acquire lock if available
      if (!isLocked) {
        await acquireLock();
      }
    };
    
    initializeLock();
    
    // Cleanup: release lock on unmount
    return () => {
      if (lockHashRef.current) {
        releaseLock();
      }
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Handle page unload
  useEffect(() => {
    const handleUnload = () => {
      if (lockHashRef.current) {
        // Use sendBeacon for reliable unload requests
        navigator.sendBeacon('/api/form-locks', JSON.stringify({
          method: 'DELETE',
          formId,
          lockHash: lockHashRef.current
        }));
      }
    };
    
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [formId]);
  
  return {
    status,
    acquireLock,
    releaseLock,
    refreshLock,
    checkLockStatus
  };
}