import { RBACManager } from '../utils/rbac';
import type { APIContext } from 'astro';
import type { D1Database } from '@cloudflare/workers-types';

export interface AuthenticatedContext extends APIContext {
  locals: APIContext['locals'] & {
    customerId: string;
    customerRole: string;
    rbac: RBACManager;
  };
}

/**
 * Authentication middleware to verify customer ID and set up RBAC
 */
export async function authenticate(
  context: APIContext
): Promise<AuthenticatedContext | Response> {
  const { request, locals } = context;
  const env = (locals as any).runtime.env;
  
  // Check for customer ID in headers
  const customerId = request.headers.get('X-Customer-ID');
  
  if (!customerId) {
    return new Response(
      JSON.stringify({ error: 'Authentication required' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Initialize RBAC manager
  const rbac = new RBACManager(env.DB as D1Database);
  
  // Get user role
  const customerRole = await rbac.getUserRole(customerId);
  
  if (!customerRole) {
    return new Response(
      JSON.stringify({ error: 'User not found or no role assigned' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Extend context with authentication data
  const authenticatedContext = context as AuthenticatedContext;
  authenticatedContext.locals.customerId = customerId;
  authenticatedContext.locals.customerRole = customerRole;
  authenticatedContext.locals.rbac = rbac;
  
  return authenticatedContext;
}

/**
 * Authorization middleware to check specific permissions
 */
export function authorize(permission: string, resource: string) {
  return async function(
    context: APIContext
  ): Promise<AuthenticatedContext | Response> {
    // First authenticate
    const authResult = await authenticate(context);
    
    if (authResult instanceof Response) {
      return authResult;
    }
    
    const { rbac, customerRole } = authResult.locals;
    
    // Check permission
    const hasPermission = await rbac.hasPermission(
      customerRole,
      permission,
      resource
    );
    
    if (!hasPermission) {
      return new Response(
        JSON.stringify({
          error: 'Insufficient permissions',
          required: { permission, resource },
          role: customerRole
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return authResult;
  };
}

/**
 * Authorization middleware for resource ownership
 */
export function authorizeOwnership(
  getResourceOwnerId: (context: AuthenticatedContext) => Promise<string | null>
) {
  return async function(
    context: APIContext
  ): Promise<AuthenticatedContext | Response> {
    // First authenticate
    const authResult = await authenticate(context);
    
    if (authResult instanceof Response) {
      return authResult;
    }
    
    const { customerId, customerRole } = authResult.locals;
    
    // Admins can access all resources
    if (customerRole === 'admin') {
      return authResult;
    }
    
    // Check ownership
    const resourceOwnerId = await getResourceOwnerId(authResult);
    
    if (!resourceOwnerId) {
      return new Response(
        JSON.stringify({ error: 'Resource not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (resourceOwnerId !== customerId) {
      return new Response(
        JSON.stringify({
          error: 'Access denied: You can only access your own resources'
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return authResult;
  };
}

/**
 * Combined middleware for authentication and multiple permission checks
 */
export function requirePermissions(
  permissions: Array<{ permission: string; resource: string }>
) {
  return async function(
    context: APIContext
  ): Promise<AuthenticatedContext | Response> {
    // First authenticate
    const authResult = await authenticate(context);
    
    if (authResult instanceof Response) {
      return authResult;
    }
    
    const { rbac, customerRole } = authResult.locals;
    
    // Check all permissions
    const hasAllPermissions = await rbac.hasPermissions(
      customerRole,
      permissions
    );
    
    if (!hasAllPermissions) {
      return new Response(
        JSON.stringify({
          error: 'Insufficient permissions',
          required: permissions,
          role: customerRole
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return authResult;
  };
}

/**
 * Helper to check if user has admin role
 */
export async function isAdmin(
  context: APIContext
): Promise<boolean> {
  const authResult = await authenticate(context);
  
  if (authResult instanceof Response) {
    return false;
  }
  
  return authResult.locals.customerRole === 'admin';
}

/**
 * Admin-only middleware
 */
export async function requireAdmin(
  context: APIContext
): Promise<AuthenticatedContext | Response> {
  const authResult = await authenticate(context);
  
  if (authResult instanceof Response) {
    return authResult;
  }
  
  if (authResult.locals.customerRole !== 'admin') {
    return new Response(
      JSON.stringify({
        error: 'Admin access required',
        role: authResult.locals.customerRole
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  return authResult;
}