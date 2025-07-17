import type { APIRoute } from 'astro';
import { z } from 'zod';

const LockRequestSchema = z.object({
  formId: z.string(),
  userId: z.string(),
  userName: z.string(),
  forceTakeover: z.boolean().optional().default(false)
});

const UnlockRequestSchema = z.object({
  formId: z.string(),
  lockHash: z.string()
});

// Acquire or refresh a form lock
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  
  // Handle test environment
  if (!env) {
    return new Response(JSON.stringify({
      success: true,
      lockHash: 'test-lock-hash',
      message: 'Test environment - lock simulated'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const body = await request.json();
    const validation = LockRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: 'Invalid request data',
        details: validation.error.issues
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { formId, userId, userName, forceTakeover } = validation.data;
    const lockHash = `${userId}_${Date.now()}`;
    const now = new Date().toISOString();
    
    // Check if form is already locked
    const existingLock = await env.DB.prepare(
      'SELECT user_name, lock_hash, last_saved FROM form_templates WHERE id = ?'
    ).bind(formId).first();
    
    if (existingLock && existingLock.lock_hash) {
      // Check if lock is stale (older than 5 minutes)
      const lastSaved = new Date(existingLock.last_saved as string);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      if (lastSaved > fiveMinutesAgo && !forceTakeover) {
        return new Response(JSON.stringify({
          error: 'Form is locked',
          lockedBy: existingLock.user_name,
          canTakeover: true
        }), {
          status: 423, // Locked
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Acquire or takeover lock
    await env.DB.prepare(
      'UPDATE form_templates SET user_name = ?, lock_hash = ?, last_saved = ? WHERE id = ?'
    ).bind(userName, lockHash, now, formId).run();
    
    return new Response(JSON.stringify({
      success: true,
      lockHash,
      message: forceTakeover ? 'Lock taken over' : 'Lock acquired'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error managing form lock:', error);
    return new Response(JSON.stringify({
      error: 'Failed to manage form lock',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Release a form lock
export const DELETE: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  
  // Handle test environment
  if (!env) {
    return new Response(JSON.stringify({
      success: true,
      message: 'Test environment - lock released'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const body = await request.json();
    const validation = UnlockRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: 'Invalid request data',
        details: validation.error.issues
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { formId, lockHash } = validation.data;
    
    // Only unlock if the lock hash matches
    const result = await env.DB.prepare(
      'UPDATE form_templates SET lock_hash = NULL, user_name = NULL WHERE id = ? AND lock_hash = ?'
    ).bind(formId, lockHash).run();
    
    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({
        error: 'Invalid lock hash or form not found'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Lock released'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error releasing form lock:', error);
    return new Response(JSON.stringify({
      error: 'Failed to release form lock',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Check lock status
export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env;
  
  // Handle test environment
  if (!env) {
    return new Response(JSON.stringify({
      locked: false
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const url = new URL(request.url);
    const formId = url.searchParams.get('formId');
    
    if (!formId) {
      return new Response(JSON.stringify({
        error: 'formId parameter is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const lock = await env.DB.prepare(
      'SELECT user_name, lock_hash, last_saved FROM form_templates WHERE id = ?'
    ).bind(formId).first();
    
    if (!lock || !lock.lock_hash) {
      return new Response(JSON.stringify({
        locked: false
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if lock is stale
    const lastSaved = new Date(lock.last_saved as string);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isStale = lastSaved <= fiveMinutesAgo;
    
    return new Response(JSON.stringify({
      locked: true,
      lockedBy: lock.user_name,
      lastActivity: lock.last_saved,
      isStale,
      canTakeover: isStale
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error checking form lock:', error);
    return new Response(JSON.stringify({
      error: 'Failed to check form lock',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};