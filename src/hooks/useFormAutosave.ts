import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { debounce } from '../utils/debounce';

interface UseFormAutosaveOptions {
  sessionId: string;
  formId: string;
  userId: string;
  userName: string;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
  debounceMs?: number;
}

interface AutosaveStatus {
  saving: boolean;
  lastSaved: Date | null;
  error: Error | null;
}

export function useFormAutosave({
  sessionId,
  formId,
  userId,
  userName,
  onSaveSuccess,
  onSaveError,
  debounceMs = 2000
}: UseFormAutosaveOptions) {
  const [status, setStatus] = useState<AutosaveStatus>({
    saving: false,
    lastSaved: null,
    error: null
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Store the latest save function in a ref to avoid recreating the debounced function
  const saveDataRef = useRef<(data: any) => Promise<any>>(null as any);
  
  // Update the ref whenever dependencies change
  useEffect(() => {
    saveDataRef.current = async (data: any): Promise<any> => {
      // Cancel any pending save
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      setStatus(prev => ({ ...prev, saving: true, error: null }));
      
      try {
        const response = await fetch('/api/form-sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            formData: data,
            templateId: parseInt(formId, 10),
            userName,
            timestamp: new Date().toISOString()
          }),
          signal: abortControllerRef.current.signal
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          let errorMessage = `Save failed: ${response.statusText}`;
          try {
            const errorJson = JSON.parse(errorData);
            if (errorJson.error) {
              errorMessage = `Save failed: ${errorJson.error}`;
            }
            if (errorJson.details) {
              errorMessage += ` - ${errorJson.details}`;
            }
          } catch {
            // If response is not JSON, use the text content
            if (errorData) {
              errorMessage = `Save failed: ${errorData}`;
            }
          }
          throw new Error(errorMessage);
        }
        
        const result = await response.json();
        
        setStatus({
          saving: false,
          lastSaved: new Date(),
          error: null
        });
        
        onSaveSuccess?.();
        
        return result;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          // Save was cancelled, ignore
          return;
        }
        
        const errorObj = error instanceof Error ? error : new Error(String(error));
        
        setStatus(prev => ({
          ...prev,
          saving: false,
          error: errorObj
        }));
        
        onSaveError?.(errorObj);
        
        // Try to save to IndexedDB as fallback
        try {
          await saveToIndexedDB(sessionId, {
            formId,
            userId,
            userName,
            data,
            lastSaved: new Date().toISOString()
          });
        } catch (idbError) {
          console.error('Failed to save to IndexedDB:', idbError);
        }
      }
    };
  }, [sessionId, formId, userId, userName, onSaveSuccess, onSaveError]);
  
  // Create a stable debounced function that persists across renders
  const debouncedSaveRef = useRef<ReturnType<typeof debounce> | null>(null);
  
  // Initialize the debounced function only once
  if (!debouncedSaveRef.current) {
    debouncedSaveRef.current = debounce((data: any) => {
      saveDataRef.current?.(data);
    }, debounceMs);
  }
  
  // Create a stable callback that uses the debounced function
  const debouncedSave = useCallback((data: any) => {
    debouncedSaveRef.current?.(data);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      debouncedSaveRef.current?.cancel();
    };
  }, []);
  
  // Load initial data from session
  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`/api/form-sessions?sessionId=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      }
      
      // Try loading from IndexedDB
      try {
        const data = await loadFromIndexedDB(sessionId);
        return data;
      } catch (error) {
        console.error('Failed to load from IndexedDB:', error);
      }
      
      return null;
    };
    
    loadSession();
  }, [sessionId]);
  
  return {
    save: debouncedSave,
    status,
    deleteSession: async () => {
      try {
        await fetch(`/api/form-sessions?sessionId=${sessionId}`, {
          method: 'DELETE'
        });
        
        // Also delete from IndexedDB
        await deleteFromIndexedDB(sessionId);
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };
}

// IndexedDB helper functions
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FormAutosave', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('sessions')) {
        db.createObjectStore('sessions', { keyPath: 'sessionId' });
      }
    };
  });
}

async function saveToIndexedDB(sessionId: string, data: any): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(['sessions'], 'readwrite');
  const store = transaction.objectStore('sessions');
  
  return new Promise((resolve, reject) => {
    const request = store.put({ sessionId, ...data, savedAt: new Date().toISOString() });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function loadFromIndexedDB(sessionId: string): Promise<any> {
  const db = await openDB();
  const transaction = db.transaction(['sessions'], 'readonly');
  const store = transaction.objectStore('sessions');
  
  return new Promise((resolve, reject) => {
    const request = store.get(sessionId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteFromIndexedDB(sessionId: string): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction(['sessions'], 'readwrite');
  const store = transaction.objectStore('sessions');
  
  return new Promise((resolve, reject) => {
    const request = store.delete(sessionId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}