import type { D1Database } from '@cloudflare/workers-types';
import { getD1Manager, type D1ConnectionManager } from './d1-connection-manager';

export interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  role_id: number;
  resource_type: string;
  resource_id: number | null;
  action: string;
  created_at: string;
}

export interface UserRole {
  user_id: number;
  role_id: number;
  assigned_at: string;
  assigned_by: number;
}

export interface TemplatePermission {
  id: number;
  template_id: number;
  user_id: number;
  permission_type: string;
  granted_at: string;
  granted_by: number;
}

export interface PermissionAuditLog {
  id: number;
  user_id: number;
  action: string;
  resource_type: string;
  resource_id: number;
  details: string;
  created_at: string;
}

export class ClinicalPermissionsService {
  private d1Manager: D1ConnectionManager;

  // Cache TTLs (in milliseconds)
  private readonly ROLE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly PERMISSION_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly USER_ROLE_CACHE_TTL = 2 * 60 * 1000; // 2 minutes
  private readonly TEMPLATE_ACCESS_CACHE_TTL = 2 * 60 * 1000; // 2 minutes
  private readonly AUDIT_LOG_CACHE_TTL = 1 * 60 * 1000; // 1 minute

  // Prepared statement keys
  private readonly STMT_GET_ALL_ROLES = 'get_all_roles';
  private readonly STMT_GET_ROLE_BY_ID = 'get_role_by_id';
  private readonly STMT_GET_USER_ROLES = 'get_user_roles';
  private readonly STMT_GET_ROLE_PERMISSIONS = 'get_role_permissions';
  private readonly STMT_GET_USER_PERMISSIONS = 'get_user_permissions';
  private readonly STMT_GET_USER_TEMPLATE_PERMISSIONS = 'get_user_template_permissions';
  private readonly STMT_CHECK_TEMPLATE_ACCESS = 'check_template_access';
  private readonly STMT_CHECK_SUBMISSION_ACCESS = 'check_submission_access';
  private readonly STMT_CHECK_ROLE_EXISTS = 'check_role_exists';
  private readonly STMT_ASSIGN_ROLE_TO_USER = 'assign_role_to_user';
  private readonly STMT_REMOVE_ROLE_FROM_USER = 'remove_role_from_user';
  private readonly STMT_GRANT_TEMPLATE_PERMISSION = 'grant_template_permission';
  private readonly STMT_REVOKE_TEMPLATE_PERMISSION = 'revoke_template_permission';

  constructor(DB: D1Database) {
    this.d1Manager = getD1Manager(DB);
  }

  // Role Management
  async getAllRoles(): Promise<Role[]> {
    return this.d1Manager.executeWithCache(
      'all-roles',
      async () => {
        const stmt = this.d1Manager.prepare(
          'SELECT * FROM clinical_roles ORDER BY name'
        );
        const response = await stmt.all();
        return response.success ? (response.results as unknown as Role[]) : [];
      },
      this.ROLE_CACHE_TTL
    );
  }

  async getRoleById(roleId: number): Promise<Role | null> {
    return this.d1Manager.executeWithCache(
      `role-${roleId}`,
      async () => {
        const stmt = this.d1Manager.prepare(
          'SELECT * FROM clinical_roles WHERE id = ?'
        );
        const response = await stmt.bind(roleId).first();
        return response as Role | null;
      },
      this.ROLE_CACHE_TTL
    );
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    return this.d1Manager.executeWithCache(
      `user-roles-${userId}`,
      async () => {
        const stmt = this.d1Manager.prepare(`
          SELECT r.* 
          FROM clinical_roles r
          JOIN clinical_user_roles ur ON r.id = ur.role_id
          WHERE ur.user_id = ?
          ORDER BY r.name
        `);
        const response = await stmt.bind(userId).all();
        return response.success ? (response.results as unknown as Role[]) : [];
      },
      this.USER_ROLE_CACHE_TTL
    );
  }

  // Permission Checks
  async getUserPermissions(userId: number): Promise<Permission[]> {
    return this.d1Manager.executeWithCache(
      `user-permissions-${userId}`,
      async () => {
        const stmt = this.d1Manager.prepare(`
          SELECT DISTINCT p.*
          FROM clinical_permissions p
          JOIN clinical_user_roles ur ON p.role_id = ur.role_id
          WHERE ur.user_id = ?
          ORDER BY p.resource_type, p.resource_id, p.action
        `);
        const response = await stmt.bind(userId).all();
        return response.success ? (response.results as unknown as Permission[]) : [];
      },
      this.PERMISSION_CACHE_TTL
    );
  }

  async getRolePermissions(roleId: number): Promise<Permission[]> {
    return this.d1Manager.executeWithCache(
      `role-permissions-${roleId}`,
      async () => {
        const stmt = this.d1Manager.prepare(`
          SELECT * FROM clinical_permissions 
          WHERE role_id = ? 
          ORDER BY resource_type, resource_id, action
        `);
        const response = await stmt.bind(roleId).all();
        return response.success ? (response.results as unknown as Permission[]) : [];
      },
      this.PERMISSION_CACHE_TTL
    );
  }

  async getUserTemplatePermissions(userId: number): Promise<TemplatePermission[]> {
    return this.d1Manager.executeWithCache(
      `user-template-permissions-${userId}`,
      async () => {
        const stmt = this.d1Manager.prepare(`
          SELECT * FROM clinical_template_permissions 
          WHERE user_id = ? 
          ORDER BY template_id, permission_type
        `);
        const response = await stmt.bind(userId).all();
        return response.success ? (response.results as unknown as TemplatePermission[]) : [];
      },
      this.TEMPLATE_ACCESS_CACHE_TTL
    );
  }

  async getAccessibleTemplates(userId: number, permissionType: string = 'read'): Promise<number[]> {
    return this.d1Manager.executeWithCache(
      `accessible-templates-${userId}-${permissionType}`,
      async () => {
        const stmt = this.d1Manager.prepare(`
          SELECT DISTINCT ft.id
          FROM form_templates ft
          WHERE ft.id IN (
            -- Templates user created
            SELECT id FROM form_templates WHERE created_by = ?
            UNION
            -- Templates with direct permissions
            SELECT template_id FROM clinical_template_permissions 
            WHERE user_id = ? AND permission_type = ?
            UNION
            -- Templates accessible through roles
            SELECT p.resource_id 
            FROM clinical_permissions p
            JOIN clinical_user_roles ur ON p.role_id = ur.role_id
            WHERE ur.user_id = ? 
              AND p.resource_type = 'form_template' 
              AND p.action = ?
          )
        `);
        const response = await stmt.bind(userId, userId, permissionType, userId, permissionType).all();
        return response.success ? response.results.map(r => r.id as number) : [];
      },
      this.TEMPLATE_ACCESS_CACHE_TTL
    );
  }

  async getAccessibleSubmissions(userId: number, permissionType: string = 'read'): Promise<number[]> {
    return this.d1Manager.executeWithCache(
      `accessible-submissions-${userId}-${permissionType}`,
      async () => {
        const stmt = this.d1Manager.prepare(`
          SELECT DISTINCT fs.id
          FROM form_submissions fs
          JOIN form_templates ft ON fs.form_template_id = ft.id
          WHERE fs.id IN (
            -- Submissions user created
            SELECT id FROM form_submissions WHERE created_by = ?
            UNION
            -- Submissions for templates with permissions
            SELECT fs2.id 
            FROM form_submissions fs2
            JOIN clinical_template_permissions ctp ON fs2.form_template_id = ctp.template_id
            WHERE ctp.user_id = ? AND ctp.permission_type = ?
            UNION
            -- Submissions accessible through roles
            SELECT fs3.id
            FROM form_submissions fs3
            JOIN clinical_permissions p ON p.resource_id = fs3.form_template_id
            JOIN clinical_user_roles ur ON p.role_id = ur.role_id
            WHERE ur.user_id = ? 
              AND p.resource_type = 'form_template'
              AND p.action = ?
          )
        `);
        const response = await stmt.bind(userId, userId, permissionType, userId, permissionType).all();
        const results = response.success ? response.results : [];
        
        // Return submission IDs
        return results.map(submission => submission.id as number);
      },
      this.TEMPLATE_ACCESS_CACHE_TTL
    );
  }

  async canAccessTemplate(userId: number, templateId: number, action: string = 'read'): Promise<boolean> {
    const cacheKey = `template-access-${userId}-${templateId}-${action}`;
    const template = await this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.d1Manager.prepare(`
          SELECT 1
          FROM form_templates ft
          WHERE ft.id = ?
            AND (
              -- User created the template
              ft.created_by = ?
              -- Direct permission
              OR EXISTS (
                SELECT 1 FROM clinical_template_permissions
                WHERE template_id = ? AND user_id = ? AND permission_type = ?
              )
              -- Role-based permission
              OR EXISTS (
                SELECT 1 
                FROM clinical_permissions p
                JOIN clinical_user_roles ur ON p.role_id = ur.role_id
                WHERE ur.user_id = ?
                  AND p.resource_type = 'form_template'
                  AND (p.resource_id = ? OR p.resource_id IS NULL)
                  AND p.action = ?
              )
            )
          LIMIT 1
        `);
        return await stmt.bind(templateId, userId, templateId, userId, action, userId, templateId, action).first();
      },
      this.TEMPLATE_ACCESS_CACHE_TTL
    );

    return !!template;
  }

  async canAccessSubmission(userId: number, submissionId: number, action: string = 'read'): Promise<boolean> {
    const cacheKey = `submission-access-${userId}-${submissionId}-${action}`;
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.d1Manager.prepare(`
          SELECT 1
          FROM form_submissions fs
          JOIN form_templates ft ON fs.form_template_id = ft.id
          WHERE fs.id = ?
            AND (
              -- User created the submission
              fs.created_by = ?
              -- Can access the template
              OR ft.created_by = ?
              OR EXISTS (
                SELECT 1 FROM clinical_template_permissions
                WHERE template_id = ft.id AND user_id = ? AND permission_type = ?
              )
              OR EXISTS (
                SELECT 1 
                FROM clinical_permissions p
                JOIN clinical_user_roles ur ON p.role_id = ur.role_id
                WHERE ur.user_id = ?
                  AND p.resource_type = 'form_template'
                  AND (p.resource_id = ft.id OR p.resource_id IS NULL)
                  AND p.action = ?
              )
            )
          LIMIT 1
        `);
        const response = await stmt.bind(submissionId, userId, userId, userId, action, userId, action).first();
        return !!response;
      },
      this.TEMPLATE_ACCESS_CACHE_TTL
    );
  }

  // Role Assignment
  async assignRoleToUser(userId: number, roleId: number, assignedBy: number): Promise<boolean> {
    // Check if role exists
    const roleExists = await this.d1Manager.prepare(
      'SELECT 1 FROM clinical_roles WHERE id = ?'
    ).bind(roleId).first();

    if (!roleExists) {
      throw new Error(`Role with ID ${roleId} does not exist`);
    }

    const response = await this.d1Manager.prepare(
      'INSERT INTO clinical_user_roles (user_id, role_id, assigned_by) VALUES (?, ?, ?)'
    ).bind(userId, roleId, assignedBy).run();

    if (response.success) {
      // Clear relevant caches
      this.clearUserPermissionCaches(userId);
      
      // Log the action
      await this.logPermissionChange(assignedBy, 'assign_role', 'user', userId, 
        `Assigned role ${roleId} to user ${userId}`);
    }

    return response.success;
  }

  async removeRoleFromUser(userId: number, roleId: number, removedBy: number): Promise<boolean> {
    const response = await this.d1Manager.prepare(
      'DELETE FROM clinical_user_roles WHERE user_id = ? AND role_id = ?'
    ).bind(userId, roleId).run();

    if (response.success) {
      // Clear relevant caches
      this.clearUserPermissionCaches(userId);
      
      // Log the action
      await this.logPermissionChange(removedBy, 'remove_role', 'user', userId,
        `Removed role ${roleId} from user ${userId}`);
    }

    return response.success;
  }

  // Template Permission Management
  async grantTemplatePermission(
    templateId: number,
    userId: number,
    permissionType: string,
    grantedBy: number
  ): Promise<boolean> {
    // Check if granter has permission to grant
    const canGrant = await this.canAccessTemplate(grantedBy, templateId, 'write') ||
                    await this.hasRole(grantedBy, 'clinical_admin');

    if (!canGrant) {
      throw new Error('Insufficient permissions to grant template access');
    }

    const response = await this.d1Manager.prepare(`
      INSERT INTO clinical_template_permissions 
      (template_id, user_id, permission_type, granted_by) 
      VALUES (?, ?, ?, ?)
    `).bind(templateId, userId, permissionType, grantedBy).run();

    if (response.success) {
      // Clear relevant caches
      this.clearUserPermissionCaches(userId);
      this.clearTemplateAccessCaches(templateId);
      
      // Log the action
      await this.logPermissionChange(grantedBy, 'grant_permission', 'template', templateId,
        `Granted ${permissionType} permission to user ${userId} for template ${templateId}`);
    }

    return response.success;
  }

  async revokeTemplatePermission(
    templateId: number,
    userId: number,
    permissionType: string,
    revokedBy: number
  ): Promise<boolean> {
    // Check if revoker has permission to revoke
    const canRevoke = await this.canAccessTemplate(revokedBy, templateId, 'write') ||
                     await this.hasRole(revokedBy, 'clinical_admin');

    if (!canRevoke) {
      throw new Error('Insufficient permissions to revoke template access');
    }

    const response = await this.d1Manager.prepare(`
      DELETE FROM clinical_template_permissions 
      WHERE template_id = ? AND user_id = ? AND permission_type = ?
    `).bind(templateId, userId, permissionType).run();

    if (response.success) {
      // Clear relevant caches
      this.clearUserPermissionCaches(userId);
      this.clearTemplateAccessCaches(templateId);
      
      // Log the action
      await this.logPermissionChange(revokedBy, 'revoke_permission', 'template', templateId,
        `Revoked ${permissionType} permission from user ${userId} for template ${templateId}`);
    }

    return response.success;
  }

  // Audit Logging
  async logPermissionChange(
    userId: number,
    action: string,
    resourceType: string,
    resourceId: number,
    details: string
  ): Promise<void> {
    await this.d1Manager.prepare(`
      INSERT INTO clinical_permission_audit_log 
      (user_id, action, resource_type, resource_id, details)
      VALUES (?, ?, ?, ?, ?)
    `).bind(userId, action, resourceType, resourceId, details).run();
  }

  async getAuditLog(
    filters: {
      userId?: number;
      resourceType?: string;
      resourceId?: number;
      startDate?: string;
      endDate?: string;
    },
    limit: number = 100
  ): Promise<PermissionAuditLog[]> {
    return this.d1Manager.executeWithCache(
      `audit-log-${JSON.stringify(filters)}-${limit}`,
      async () => {
        let query = 'SELECT * FROM clinical_permission_audit_log WHERE 1=1';
        const params: any[] = [];

        if (filters.userId !== undefined) {
          query += ' AND user_id = ?';
          params.push(filters.userId);
        }
        if (filters.resourceType) {
          query += ' AND resource_type = ?';
          params.push(filters.resourceType);
        }
        if (filters.resourceId !== undefined) {
          query += ' AND resource_id = ?';
          params.push(filters.resourceId);
        }
        if (filters.startDate) {
          query += ' AND created_at >= ?';
          params.push(filters.startDate);
        }
        if (filters.endDate) {
          query += ' AND created_at <= ?';
          params.push(filters.endDate);
        }

        query += ' ORDER BY created_at DESC LIMIT ?';
        params.push(limit);

        // Create a unique key for this specific query
        const stmtKey = `audit-log-${params.length}`;
        const stmt = this.d1Manager.prepare(query);
        const response = await stmt.bind(...params).all();
        const logs = response.success ? (response.results as unknown as PermissionAuditLog[]) : [];

        // Parse JSON details field if it's a string
        return logs.map(log => {
          if (typeof log.details === 'string' && log.details.startsWith('{')) {
            const parsed = this.d1Manager.parseJSON(log.details);
            return {
              ...log,
              details: parsed || log.details
            };
          }
          return log;
        });
      },
      this.AUDIT_LOG_CACHE_TTL
    );
  }

  // Helper Methods
  private async hasRole(userId: number, roleName: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.some(role => role.name === roleName);
  }

  private clearUserPermissionCaches(userId: number): void {
    this.d1Manager.clearSpecificCaches([
      `user-roles-${userId}`,
      `user-permissions-${userId}`,
      `user-template-permissions-${userId}`,
      `accessible-templates-${userId}`,
      `accessible-submissions-${userId}`,
      `template-access-${userId}`,
      `submission-access-${userId}`
    ]);
  }

  private clearTemplateAccessCaches(templateId: number): void {
    this.d1Manager.clearSpecificCaches([
      `template-access-`,
      `accessible-templates-`,
      `template-${templateId}`
    ]);
  }
}