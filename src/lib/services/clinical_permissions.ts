export const CLINICAL_ROLES = {
  PATIENT: 'patient',
  CLINICIAN: 'clinician', 
  ADMIN: 'admin',
  RESEARCHER: 'researcher',
} as const;

export const PERMISSION_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  PUBLISH: 'publish',
  ARCHIVE: 'archive',
  EXPORT: 'export',
  ANALYZE: 'analyze',
} as const;

export const RESOURCE_TYPES = {
  FORM_TEMPLATE: 'form_template',
  FORM_SUBMISSION: 'form_submission',
  PATIENT_DATA: 'patient_data',
  ANALYTICS: 'analytics',
  SYSTEM_CONFIG: 'system_config',
} as const;

export const CLINICAL_PERMISSIONS_QUERIES = {
  GET_USER_ROLES: `
    SELECT cr.role_name, cr.permissions, cr.resource_access_rules
    FROM clinical_roles cr
    JOIN user_roles ur ON cr.role_name = ur.role_name
    WHERE ur.user_id = ?
  `,
  GET_USER_PERMISSIONS: `
    SELECT p.permission_name, p.resource_type, p.conditions
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN user_roles ur ON rp.role_name = ur.role_name
    WHERE ur.user_id = ?
  `,
  CHECK_RESOURCE_ACCESS: `
    SELECT COUNT(*) as has_access
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN user_roles ur ON rp.role_name = ur.role_name
    WHERE ur.user_id = ? 
    AND p.resource_type = ? 
    AND p.permission_name = ?
  `,
  GET_ACCESSIBLE_TEMPLATES: `
    SELECT DISTINCT ft.*
    FROM form_templates ft
    LEFT JOIN template_permissions tp ON ft.id = tp.template_id
    LEFT JOIN user_roles ur ON tp.role_name = ur.role_name
    WHERE (tp.template_id IS NULL AND ft.is_public = 1)
    OR (ur.user_id = ? AND tp.can_read = 1)
    OR ft.created_by = ?
  `,
  GET_ACCESSIBLE_SUBMISSIONS: `
    SELECT DISTINCT fs.*
    FROM form_submissions fs
    LEFT JOIN form_templates ft ON fs.template_id = ft.id
    LEFT JOIN template_permissions tp ON ft.id = tp.template_id
    LEFT JOIN user_roles ur ON tp.role_name = ur.role_name
    WHERE (fs.submitted_by = ?)
    OR (ur.user_id = ? AND tp.can_read = 1)
    OR (ur.user_id = ? AND EXISTS (
      SELECT 1 FROM user_roles ur2 
      WHERE ur2.user_id = ? AND ur2.role_name IN ('admin', 'clinician')
    ))
  `,
};

export interface UserPermissions {
  roles: string[];
  canCreate: (resourceType: string) => boolean;
  canRead: (resourceType: string, resourceId?: number) => boolean;
  canUpdate: (resourceType: string, resourceId?: number) => boolean;
  canDelete: (resourceType: string, resourceId?: number) => boolean;
  canPublish: (resourceType: string) => boolean;
  canArchive: (resourceType: string) => boolean;
  canExport: (resourceType: string) => boolean;
  canAnalyze: (resourceType: string) => boolean;
}

export class ClinicalPermissionsService {
  private DB: D1Database;

  constructor(DB: D1Database) {
    this.DB = DB;
  }

  async getUserPermissions(userId: number): Promise<UserPermissions> {
    // Get user roles
    const rolesResponse = await this.DB.prepare(CLINICAL_PERMISSIONS_QUERIES.GET_USER_ROLES)
      .bind(userId)
      .all();

    const roles = rolesResponse.success ? rolesResponse.results.map((r: any) => r.role_name) : [];

    // Get specific permissions
    const permissionsResponse = await this.DB.prepare(CLINICAL_PERMISSIONS_QUERIES.GET_USER_PERMISSIONS)
      .bind(userId)
      .all();

    const permissions = permissionsResponse.success ? permissionsResponse.results : [];

    return {
      roles,
      canCreate: (resourceType: string) => this.checkPermission(permissions, resourceType, PERMISSION_ACTIONS.CREATE),
      canRead: (resourceType: string, resourceId?: number) => this.checkPermission(permissions, resourceType, PERMISSION_ACTIONS.READ, resourceId),
      canUpdate: (resourceType: string, resourceId?: number) => this.checkPermission(permissions, resourceType, PERMISSION_ACTIONS.UPDATE, resourceId),
      canDelete: (resourceType: string, resourceId?: number) => this.checkPermission(permissions, resourceType, PERMISSION_ACTIONS.DELETE, resourceId),
      canPublish: (resourceType: string) => this.checkPermission(permissions, resourceType, PERMISSION_ACTIONS.PUBLISH),
      canArchive: (resourceType: string) => this.checkPermission(permissions, resourceType, PERMISSION_ACTIONS.ARCHIVE),
      canExport: (resourceType: string) => this.checkPermission(permissions, resourceType, PERMISSION_ACTIONS.EXPORT),
      canAnalyze: (resourceType: string) => this.checkPermission(permissions, resourceType, PERMISSION_ACTIONS.ANALYZE),
    };
  }

  private checkPermission(permissions: any[], resourceType: string, action: string, resourceId?: number): boolean {
    return permissions.some(permission => {
      if (permission.resource_type !== resourceType || permission.permission_name !== action) {
        return false;
      }

      // Check conditions if they exist
      if (permission.conditions && resourceId) {
        const conditions = JSON.parse(permission.conditions);
        return this.evaluateConditions(conditions, resourceId);
      }

      return true;
    });
  }

  private evaluateConditions(conditions: any, resourceId: number): boolean {
    // Placeholder for condition evaluation logic
    // In a real implementation, this would evaluate complex conditions
    // like ownership, department access, time-based restrictions, etc.
    return true;
  }

  async checkResourceAccess(userId: number, resourceType: string, action: string): Promise<boolean> {
    const response = await this.DB.prepare(CLINICAL_PERMISSIONS_QUERIES.CHECK_RESOURCE_ACCESS)
      .bind(userId, resourceType, action)
      .first();

    return (response && typeof response === 'object' && 'has_access' in response && typeof response.has_access === 'number')
      ? response.has_access > 0
      : false;
  }

  async getAccessibleTemplates(userId: number): Promise<any[]> {
    const response = await this.DB.prepare(CLINICAL_PERMISSIONS_QUERIES.GET_ACCESSIBLE_TEMPLATES)
      .bind(userId, userId)
      .all();

    if (response.success) {
      return response.results.map((template: any) => {
        // Parse JSON fields
        if (template.components) {
          template.components = JSON.parse(template.components);
        }
        if (template.styling_config) {
          template.styling_config = JSON.parse(template.styling_config);
        }
        if (template.logic_config) {
          template.logic_config = JSON.parse(template.logic_config);
        }
        if (template.scoring_config) {
          template.scoring_config = JSON.parse(template.scoring_config);
        }
        if (template.metadata) {
          template.metadata = JSON.parse(template.metadata);
        }
        return template;
      });
    }
    return [];
  }

  async getAccessibleSubmissions(userId: number): Promise<any[]> {
    const response = await this.DB.prepare(CLINICAL_PERMISSIONS_QUERIES.GET_ACCESSIBLE_SUBMISSIONS)
      .bind(userId, userId, userId, userId)
      .all();

    if (response.success) {
      return response.results.map((submission: any) => {
        // Parse JSON fields
        if (submission.responses) {
          submission.responses = JSON.parse(submission.responses);
        }
        if (submission.metadata) {
          submission.metadata = JSON.parse(submission.metadata);
        }
        return submission;
      });
    }
    return [];
  }

  async canAccessTemplate(userId: number, templateId: number, action: string = 'read'): Promise<boolean> {
    // Check if user can access specific template
    const template = await this.DB.prepare(`
      SELECT ft.*, tp.can_read, tp.can_write, ft.created_by
      FROM form_templates ft
      LEFT JOIN template_permissions tp ON ft.id = tp.template_id
      LEFT JOIN user_roles ur ON tp.role_name = ur.role_name
      WHERE ft.id = ? AND (
        (ft.is_public = 1 AND ? = 'read')
        OR (ur.user_id = ? AND tp.can_read = 1 AND ? = 'read')
        OR (ur.user_id = ? AND tp.can_write = 1 AND ? IN ('write', 'update'))
        OR ft.created_by = ?
      )
    `).bind(templateId, action, userId, action, userId, action, userId).first();

    return !!template;
  }

  async canAccessSubmission(userId: number, submissionId: number, action: string = 'read'): Promise<boolean> {
    // Check if user can access specific submission
    const submission = await this.DB.prepare(`
      SELECT fs.*, ft.id as template_id, tp.can_read, tp.can_write
      FROM form_submissions fs
      JOIN form_templates ft ON fs.template_id = ft.id
      LEFT JOIN template_permissions tp ON ft.id = tp.template_id
      LEFT JOIN user_roles ur ON tp.role_name = ur.role_name
      WHERE fs.id = ? AND (
        fs.submitted_by = ?
        OR (ur.user_id = ? AND tp.can_read = 1 AND ? = 'read')
        OR (ur.user_id = ? AND tp.can_write = 1 AND ? IN ('write', 'update'))
        OR (ur.user_id = ? AND EXISTS (
          SELECT 1 FROM user_roles ur2 
          WHERE ur2.user_id = ? AND ur2.role_name IN ('admin', 'clinician')
        ))
      )
    `).bind(submissionId, userId, userId, action, userId, action, userId, userId).first();

    return !!submission;
  }

  async assignRoleToUser(userId: number, role: string, assignedBy: number): Promise<{ success: boolean }> {
    // Check if assigner has permission to assign roles
    const canAssign = await this.checkResourceAccess(assignedBy, RESOURCE_TYPES.SYSTEM_CONFIG, PERMISSION_ACTIONS.UPDATE);
    
    if (!canAssign) {
      throw new Error("Insufficient permissions to assign roles");
    }

    // Validate role exists
    const roleExists = await this.DB.prepare(`
      SELECT COUNT(*) as count FROM clinical_roles WHERE role_name = ?
    `).bind(role).first();

    if (!roleExists?.count) {
      throw new Error("Invalid role specified");
    }

    // Insert or update user role
    const response = await this.DB.prepare(`
      INSERT OR REPLACE INTO user_roles (user_id, role_name, assigned_by, assigned_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(userId, role, assignedBy).run();

    if (!response.success) {
      throw new Error("Failed to assign role to user");
    }

    return { success: true };
  }

  async removeRoleFromUser(userId: number, role: string, removedBy: number): Promise<{ success: boolean }> {
    // Check if remover has permission
    const canRemove = await this.checkResourceAccess(removedBy, RESOURCE_TYPES.SYSTEM_CONFIG, PERMISSION_ACTIONS.UPDATE);
    
    if (!canRemove) {
      throw new Error("Insufficient permissions to remove roles");
    }

    const response = await this.DB.prepare(`
      DELETE FROM user_roles WHERE user_id = ? AND role_name = ?
    `).bind(userId, role).run();

    if (!response.success) {
      throw new Error("Failed to remove role from user");
    }

    return { success: true };
  }

  async grantTemplatePermission(templateId: number, role: string, permissions: {
    can_read?: boolean;
    can_write?: boolean;
  }, grantedBy: number): Promise<{ success: boolean }> {
    // Check if granter can manage template permissions
    const canGrant = await this.canAccessTemplate(grantedBy, templateId, 'write') ||
                     await this.checkResourceAccess(grantedBy, RESOURCE_TYPES.SYSTEM_CONFIG, PERMISSION_ACTIONS.UPDATE);
    
    if (!canGrant) {
      throw new Error("Insufficient permissions to grant template access");
    }

    const response = await this.DB.prepare(`
      INSERT OR REPLACE INTO template_permissions 
      (template_id, role_name, can_read, can_write, granted_by, granted_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      templateId,
      role,
      permissions.can_read ? 1 : 0,
      permissions.can_write ? 1 : 0,
      grantedBy
    ).run();

    if (!response.success) {
      throw new Error("Failed to grant template permission");
    }

    return { success: true };
  }

  async revokeTemplatePermission(templateId: number, role: string, revokedBy: number): Promise<{ success: boolean }> {
    // Check if revoker can manage template permissions
    const canRevoke = await this.canAccessTemplate(revokedBy, templateId, 'write') ||
                      await this.checkResourceAccess(revokedBy, RESOURCE_TYPES.SYSTEM_CONFIG, PERMISSION_ACTIONS.UPDATE);
    
    if (!canRevoke) {
      throw new Error("Insufficient permissions to revoke template access");
    }

    const response = await this.DB.prepare(`
      DELETE FROM template_permissions WHERE template_id = ? AND role_name = ?
    `).bind(templateId, role).run();

    if (!response.success) {
      throw new Error("Failed to revoke template permission");
    }

    return { success: true };
  }

  async getAuditLog(filters?: {
    user_id?: number;
    resource_type?: string;
    action?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<any[]> {
    let query = `
      SELECT * FROM audit_logs
      WHERE 1 = 1
    `;
    let bindParams: any[] = [];

    if (filters?.user_id) {
      query += ` AND user_id = ?`;
      bindParams.push(filters.user_id);
    }

    if (filters?.resource_type) {
      query += ` AND resource_type = ?`;
      bindParams.push(filters.resource_type);
    }

    if (filters?.action) {
      query += ` AND action = ?`;
      bindParams.push(filters.action);
    }

    if (filters?.date_from && filters?.date_to) {
      query += ` AND created_at BETWEEN ? AND ?`;
      bindParams.push(filters.date_from, filters.date_to);
    }

    query += ` ORDER BY created_at DESC LIMIT 1000`;

    const response = await this.DB.prepare(query).bind(...bindParams).all();

    if (response.success) {
      return response.results.map((log: any) => {
        if (log.metadata) {
          log.metadata = JSON.parse(log.metadata);
        }
        return log;
      });
    }
    return [];
  }
}