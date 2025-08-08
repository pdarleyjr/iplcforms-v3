globalThis.process ??= {}; globalThis.process.env ??= {};
class RBACManager {
  db;
  cache = /* @__PURE__ */ new Map();
  constructor(db) {
    this.db = db;
  }
  /**
   * Check if a user has permission to perform an action on a resource
   */
  async hasPermission(role, permission, resource) {
    const cacheKey = `${role}:${permission}:${resource}`;
    const cached = this.cache.get(cacheKey);
    if (cached !== void 0) {
      return cached.length > 0;
    }
    try {
      const result = await this.db.prepare(
        "SELECT 1 FROM clinical_permissions WHERE role = ? AND permission = ? AND resource = ?"
      ).bind(role, permission, resource).first();
      const hasAccess = result !== null;
      this.cache.set(cacheKey, hasAccess ? [result] : []);
      return hasAccess;
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }
  /**
   * Get all permissions for a role
   */
  async getRolePermissions(role) {
    const cacheKey = `role:${role}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    try {
      const { results } = await this.db.prepare("SELECT * FROM clinical_permissions WHERE role = ?").bind(role).all();
      const permissions = results;
      this.cache.set(cacheKey, permissions);
      return permissions;
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      return [];
    }
  }
  /**
   * Get all available roles
   */
  async getAllRoles() {
    try {
      const { results } = await this.db.prepare("SELECT DISTINCT role FROM clinical_permissions").all();
      return results.map((r) => r.role);
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }
  /**
   * Add a new permission
   */
  async addPermission(role, permission, resource) {
    try {
      await this.db.prepare(
        "INSERT OR IGNORE INTO clinical_permissions (role, permission, resource) VALUES (?, ?, ?)"
      ).bind(role, permission, resource).run();
      this.clearRoleCache(role);
      return true;
    } catch (error) {
      console.error("Error adding permission:", error);
      return false;
    }
  }
  /**
   * Remove a permission
   */
  async removePermission(role, permission, resource) {
    try {
      await this.db.prepare(
        "DELETE FROM clinical_permissions WHERE role = ? AND permission = ? AND resource = ?"
      ).bind(role, permission, resource).run();
      this.clearRoleCache(role);
      return true;
    } catch (error) {
      console.error("Error removing permission:", error);
      return false;
    }
  }
  /**
   * Update user role
   */
  async updateUserRole(customerId, newRole) {
    try {
      await this.db.prepare("UPDATE customers SET role = ? WHERE id = ?").bind(newRole, customerId).run();
      return true;
    } catch (error) {
      console.error("Error updating user role:", error);
      return false;
    }
  }
  /**
   * Get user role
   */
  async getUserRole(customerId) {
    try {
      const result = await this.db.prepare("SELECT role FROM customers WHERE id = ?").bind(customerId).first();
      return result ? result.role : null;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  }
  /**
   * Clear cache for a specific role
   */
  clearRoleCache(role) {
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${role}:`) || key === `role:${role}`) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key));
  }
  /**
   * Clear entire cache
   */
  clearCache() {
    this.cache.clear();
  }
  /**
   * Batch check multiple permissions
   */
  async hasPermissions(role, permissions) {
    const checks = await Promise.all(
      permissions.map(
        ({ permission, resource }) => this.hasPermission(role, permission, resource)
      )
    );
    return checks.every((check) => check === true);
  }
  /**
   * Get all permissions grouped by role
   */
  async getAllPermissionsGrouped() {
    try {
      const { results } = await this.db.prepare(
        "SELECT role, permission, resource FROM clinical_permissions ORDER BY role, resource, permission"
      ).all();
      const grouped = /* @__PURE__ */ new Map();
      for (const row of results) {
        if (!grouped.has(row.role)) {
          grouped.set(row.role, {
            role: row.role,
            permissions: []
          });
        }
        grouped.get(row.role).permissions.push({
          permission: row.permission,
          resource: row.resource
        });
      }
      return Array.from(grouped.values());
    } catch (error) {
      console.error("Error fetching grouped permissions:", error);
      return [];
    }
  }
}
const PERMISSIONS = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  MANAGE: "manage",
  EXPORT: "export",
  CONFIGURE: "configure"
};
const RESOURCES = {
  FORM_TEMPLATES: "form_templates",
  FORM_SUBMISSIONS: "form_submissions",
  PATIENT_DATA: "patient_data",
  ASSESSMENTS: "assessments",
  USERS: "users",
  ANALYTICS: "analytics",
  PERMISSIONS: "permissions",
  ORGANIZATIONS: "organizations",
  ALL_DATA: "all_data",
  SYSTEM: "system",
  OWN_TEMPLATES: "own_templates",
  OWN_SUBMISSIONS: "own_submissions",
  OWN_PROFILE: "own_profile",
  AGGREGATED_DATA: "aggregated_data",
  RESEARCH_QUERIES: "research_queries"
};
const ROLES = {
  PATIENT: "patient",
  CLINICIAN: "clinician",
  ADMIN: "admin",
  RESEARCHER: "researcher"
};

export { PERMISSIONS as P, ROLES as R, RESOURCES as a, RBACManager as b };
//# sourceMappingURL=rbac_vK5lyOl9.mjs.map
