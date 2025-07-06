import type { D1Database } from '@cloudflare/workers-types';

export interface Permission {
  id: number;
  role: string;
  permission: string;
  resource: string;
  created_at: string;
}

export interface RolePermissions {
  role: string;
  permissions: Array<{
    permission: string;
    resource: string;
  }>;
}

export class RBACManager {
  private db: D1Database;
  private cache: Map<string, Permission[]> = new Map();

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * Check if a user has permission to perform an action on a resource
   */
  async hasPermission(
    role: string,
    permission: string,
    resource: string
  ): Promise<boolean> {
    const cacheKey = `${role}:${permission}:${resource}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached !== undefined) {
      return cached.length > 0;
    }

    try {
      const result = await this.db
        .prepare(
          'SELECT 1 FROM clinical_permissions WHERE role = ? AND permission = ? AND resource = ?'
        )
        .bind(role, permission, resource)
        .first();

      const hasAccess = result !== null;
      this.cache.set(cacheKey, hasAccess ? [result as any] : []);
      
      return hasAccess;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Get all permissions for a role
   */
  async getRolePermissions(role: string): Promise<Permission[]> {
    const cacheKey = `role:${role}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const { results } = await this.db
        .prepare('SELECT * FROM clinical_permissions WHERE role = ?')
        .bind(role)
        .all();

      const permissions = results as unknown as Permission[];
      this.cache.set(cacheKey, permissions);
      
      return permissions;
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      return [];
    }
  }

  /**
   * Get all available roles
   */
  async getAllRoles(): Promise<string[]> {
    try {
      const { results } = await this.db
        .prepare('SELECT DISTINCT role FROM clinical_permissions')
        .all();

      return results.map((r: any) => r.role);
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  }

  /**
   * Add a new permission
   */
  async addPermission(
    role: string,
    permission: string,
    resource: string
  ): Promise<boolean> {
    try {
      await this.db
        .prepare(
          'INSERT OR IGNORE INTO clinical_permissions (role, permission, resource) VALUES (?, ?, ?)'
        )
        .bind(role, permission, resource)
        .run();

      // Clear cache for this role
      this.clearRoleCache(role);
      
      return true;
    } catch (error) {
      console.error('Error adding permission:', error);
      return false;
    }
  }

  /**
   * Remove a permission
   */
  async removePermission(
    role: string,
    permission: string,
    resource: string
  ): Promise<boolean> {
    try {
      await this.db
        .prepare(
          'DELETE FROM clinical_permissions WHERE role = ? AND permission = ? AND resource = ?'
        )
        .bind(role, permission, resource)
        .run();

      // Clear cache for this role
      this.clearRoleCache(role);
      
      return true;
    } catch (error) {
      console.error('Error removing permission:', error);
      return false;
    }
  }

  /**
   * Update user role
   */
  async updateUserRole(customerId: string, newRole: string): Promise<boolean> {
    try {
      await this.db
        .prepare('UPDATE customers SET role = ? WHERE id = ?')
        .bind(newRole, customerId)
        .run();

      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  }

  /**
   * Get user role
   */
  async getUserRole(customerId: string): Promise<string | null> {
    try {
      const result = await this.db
        .prepare('SELECT role FROM customers WHERE id = ?')
        .bind(customerId)
        .first();

      return result ? (result as any).role : null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  /**
   * Clear cache for a specific role
   */
  private clearRoleCache(role: string): void {
    // Clear all cache entries related to this role
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${role}:`) || key === `role:${role}`) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear entire cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Batch check multiple permissions
   */
  async hasPermissions(
    role: string,
    permissions: Array<{ permission: string; resource: string }>
  ): Promise<boolean> {
    const checks = await Promise.all(
      permissions.map(({ permission, resource }) =>
        this.hasPermission(role, permission, resource)
      )
    );

    return checks.every(check => check === true);
  }

  /**
   * Get all permissions grouped by role
   */
  async getAllPermissionsGrouped(): Promise<RolePermissions[]> {
    try {
      const { results } = await this.db
        .prepare(
          'SELECT role, permission, resource FROM clinical_permissions ORDER BY role, resource, permission'
        )
        .all();

      const grouped = new Map<string, RolePermissions>();

      for (const row of results as any[]) {
        if (!grouped.has(row.role)) {
          grouped.set(row.role, {
            role: row.role,
            permissions: []
          });
        }

        grouped.get(row.role)!.permissions.push({
          permission: row.permission,
          resource: row.resource
        });
      }

      return Array.from(grouped.values());
    } catch (error) {
      console.error('Error fetching grouped permissions:', error);
      return [];
    }
  }
}

// Helper function to create RBAC middleware
export function requirePermission(
  permission: string,
  resource: string
) {
  return async function checkPermission(
    request: Request,
    env: any,
    ctx: any,
    next: () => Promise<Response>
  ): Promise<Response> {
    const customerId = request.headers.get('X-Customer-ID');
    
    if (!customerId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const rbac = new RBACManager(env.DB);
    const role = await rbac.getUserRole(customerId);
    
    if (!role) {
      return new Response('User role not found', { status: 403 });
    }

    const hasAccess = await rbac.hasPermission(role, permission, resource);
    
    if (!hasAccess) {
      return new Response('Insufficient permissions', { status: 403 });
    }

    return next();
  };
}

// Permission constants for consistency
export const PERMISSIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  EXPORT: 'export',
  CONFIGURE: 'configure'
} as const;

export const RESOURCES = {
  FORM_TEMPLATES: 'form_templates',
  FORM_SUBMISSIONS: 'form_submissions',
  PATIENT_DATA: 'patient_data',
  ASSESSMENTS: 'assessments',
  USERS: 'users',
  ANALYTICS: 'analytics',
  PERMISSIONS: 'permissions',
  ORGANIZATIONS: 'organizations',
  ALL_DATA: 'all_data',
  SYSTEM: 'system',
  OWN_TEMPLATES: 'own_templates',
  OWN_SUBMISSIONS: 'own_submissions',
  OWN_PROFILE: 'own_profile',
  AGGREGATED_DATA: 'aggregated_data',
  RESEARCH_QUERIES: 'research_queries'
} as const;

export const ROLES = {
  PATIENT: 'patient',
  CLINICIAN: 'clinician',
  ADMIN: 'admin',
  RESEARCHER: 'researcher'
} as const;