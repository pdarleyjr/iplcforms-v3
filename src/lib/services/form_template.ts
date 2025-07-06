import type { D1Database } from '@cloudflare/workers-types';
import { D1ConnectionManager } from './d1-connection-manager';

export const FORM_TEMPLATE_QUERIES = {
  BASE_SELECT: `
    SELECT
      ft.*,
      c.name as created_by_name,
      c.email as created_by_email,
      COUNT(fs.id) as submission_count
    FROM form_templates ft
    LEFT JOIN customers c ON ft.created_by = c.id
    LEFT JOIN form_submissions fs ON ft.id = fs.template_id
  `,
  INSERT_TEMPLATE: `
    INSERT INTO form_templates (
      name, description, category, form_config, metadata, created_by
    ) VALUES (?, ?, ?, ?, ?, ?)
  `,
  UPDATE_TEMPLATE: `
    UPDATE form_templates
    SET name = ?, description = ?, category = ?, form_config = ?,
        metadata = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  DELETE_TEMPLATE: `UPDATE form_templates SET is_active = false WHERE id = ?`,
  GET_BY_ID: `WHERE ft.id = ? GROUP BY ft.id`,
  GET_BY_CATEGORY: `WHERE ft.category = ? AND ft.is_active = true GROUP BY ft.id`,
  GET_BY_STATUS: `WHERE ft.is_published = ? AND ft.is_active = true GROUP BY ft.id`,
  GET_VERSIONS: `WHERE ft.parent_template_id = ? OR ft.id = ? GROUP BY ft.id ORDER BY ft.version DESC`,
  SEARCH: `WHERE (ft.name LIKE ? OR ft.description LIKE ?) AND ft.is_active = true GROUP BY ft.id`,
  
  // Analytics and aggregation queries
  TEMPLATE_ANALYTICS: `
    SELECT
      ft.id,
      ft.name,
      ft.category,
      COUNT(DISTINCT fs.id) as total_submissions,
      COUNT(DISTINCT CASE WHEN fs.status = 'completed' THEN fs.id END) as completed_submissions,
      AVG(fs.completion_time_seconds) as avg_completion_time,
      AVG(fs.calculated_score) as avg_score,
      COUNT(DISTINCT fs.customer_id) as unique_users
    FROM form_templates ft
    LEFT JOIN form_submissions fs ON ft.id = fs.template_id
    WHERE ft.id = ?
    GROUP BY ft.id, ft.name, ft.category
  `,
  
  POPULAR_TEMPLATES: `
    SELECT
      ft.id,
      ft.name,
      ft.category,
      COUNT(fs.id) as submission_count,
      COUNT(DISTINCT fs.customer_id) as unique_users,
      AVG(fs.calculated_score) as avg_score
    FROM form_templates ft
    LEFT JOIN form_submissions fs ON ft.id = fs.template_id
    WHERE ft.is_active = true AND ft.is_published = true
    GROUP BY ft.id, ft.name, ft.category
    ORDER BY submission_count DESC, unique_users DESC
    LIMIT ?
  `,
  
  CATEGORY_STATS: `
    SELECT
      ft.category,
      COUNT(DISTINCT ft.id) as template_count,
      COUNT(fs.id) as total_submissions,
      AVG(fs.calculated_score) as avg_score
    FROM form_templates ft
    LEFT JOIN form_submissions fs ON ft.id = fs.template_id
    WHERE ft.is_active = true
    GROUP BY ft.category
    ORDER BY template_count DESC
  `
};

const processTemplateResults = (connectionManager: D1ConnectionManager) => {
  return (rows: any[]) => {
    return rows.map((row) => {
      const template = { ...row };
      
      // Use optimized JSON parsing
      if (template.form_config) {
        template.form_config = connectionManager.parseJSON(template.form_config);
      }
      if (template.metadata) {
        template.metadata = connectionManager.parseJSON(template.metadata);
      }

      // Add creator info
      if (template.created_by_name) {
        template.created_by_info = {
          name: template.created_by_name,
          email: template.created_by_email,
        };
        delete template.created_by_name;
        delete template.created_by_email;
      }

      return template;
    });
  };
};

export class FormTemplateService {
  private DB: D1Database;
  private connectionManager: D1ConnectionManager;

  constructor(DB: D1Database) {
    this.DB = DB;
    this.connectionManager = new D1ConnectionManager(DB);
  }

  async getById(id: number) {
    const cacheKey = `template:${id}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${FORM_TEMPLATE_QUERIES.BASE_SELECT} ${FORM_TEMPLATE_QUERIES.GET_BY_ID}`;
        const response = await this.connectionManager.prepare(query).bind(id).all();

        if (response.success && response.results.length > 0) {
          const [template] = processTemplateResults(this.connectionManager)(response.results);
          return template;
        }
        return null;
      },
      5 * 60 // 5 minutes cache
    );
  }

  async getAll(filters?: {
    category?: string;
    status?: boolean;
    search?: string;
    page?: number;
    per_page?: number;
  }) {
    // Create cache key based on filters
    const cacheKey = `templates:all:${JSON.stringify(filters || {})}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        let query = FORM_TEMPLATE_QUERIES.BASE_SELECT;
        let bindParams: any[] = [];
        
        if (filters?.category) {
          query += ` ${FORM_TEMPLATE_QUERIES.GET_BY_CATEGORY}`;
          bindParams.push(filters.category);
        } else if (filters?.status !== undefined) {
          query += ` ${FORM_TEMPLATE_QUERIES.GET_BY_STATUS}`;
          bindParams.push(filters.status);
        } else if (filters?.search) {
          query += ` ${FORM_TEMPLATE_QUERIES.SEARCH}`;
          bindParams.push(`%${filters.search}%`, `%${filters.search}%`);
        } else {
          query += ` WHERE ft.is_active = true GROUP BY ft.id`;
        }

        query += ` ORDER BY ft.updated_at DESC`;

        // Add pagination
        if (filters?.page && filters?.per_page) {
          const offset = (filters.page - 1) * filters.per_page;
          query += ` LIMIT ? OFFSET ?`;
          bindParams.push(filters.per_page, offset);
        }

        const response = await this.connectionManager.prepare(query).bind(...bindParams).all();

        if (response.success) {
          return processTemplateResults(this.connectionManager)(response.results);
        }
        return [];
      },
      2 * 60 // 2 minutes cache for lists
    );
  }

  async getVersions(templateId: number) {
    const cacheKey = `template:versions:${templateId}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${FORM_TEMPLATE_QUERIES.BASE_SELECT} ${FORM_TEMPLATE_QUERIES.GET_VERSIONS}`;
        const response = await this.connectionManager.prepare(query).bind(templateId, templateId).all();

        if (response.success) {
          return processTemplateResults(this.connectionManager)(response.results);
        }
        return [];
      },
      2 * 60 // 2 minutes cache
    );
  }

  async create(templateData: {
    name: string;
    description?: string;
    category: string;
    form_config: object;
    metadata?: object;
    created_by: number;
  }) {
    const {
      name,
      description,
      category,
      form_config,
      metadata,
      created_by,
    } = templateData;

    const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.INSERT_TEMPLATE)
      .bind(
        name,
        description || null,
        category,
        JSON.stringify(form_config),
        JSON.stringify(metadata || {}),
        created_by
      )
      .run();

    if (!response.success) {
      throw new Error("Failed to create form template");
    }

    const templateId = response.meta.last_row_id;
    
    // Clear relevant caches
    this.connectionManager.clearSpecificCaches(['templates:all:', 'popular_templates', 'category_stats']);
    
    return { success: true, templateId };
  }

  async update(id: number, templateData: {
    name?: string;
    description?: string;
    category?: string;
    form_config?: object;
    metadata?: object;
  }) {
    // First get the existing template
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error("Template not found");
    }

    const {
      name = existing.name,
      description = existing.description,
      category = existing.category,
      form_config = existing.form_config,
      metadata = existing.metadata,
    } = templateData;

    const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.UPDATE_TEMPLATE)
      .bind(
        name,
        description,
        category,
        JSON.stringify(form_config),
        JSON.stringify(metadata),
        id
      )
      .run();

    if (!response.success) {
      throw new Error("Failed to update form template");
    }

    // Clear relevant caches
    this.connectionManager.clearSpecificCaches([
      `template:${id}`,
      `template:versions:${id}`,
      'templates:all:',
      'popular_templates',
      'category_stats'
    ]);

    return { success: true };
  }

  async delete(id: number) {
    const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.DELETE_TEMPLATE)
      .bind(id)
      .run();

    if (!response.success) {
      throw new Error("Failed to delete form template");
    }

    // Clear relevant caches
    this.connectionManager.clearSpecificCaches([
      `template:${id}`,
      `template:versions:${id}`,
      'templates:all:',
      'popular_templates',
      'category_stats'
    ]);

    return { success: true };
  }

  async publish(id: number) {
    const response = await this.connectionManager.prepare(`UPDATE form_templates SET is_published = true WHERE id = ?`)
      .bind(id)
      .run();

    if (!response.success) {
      throw new Error("Failed to publish template");
    }

    // Clear relevant caches
    this.connectionManager.clearSpecificCaches([
      `template:${id}`,
      'templates:all:',
      'popular_templates'
    ]);

    return { success: true };
  }

  async unpublish(id: number) {
    const response = await this.connectionManager.prepare(`UPDATE form_templates SET is_published = false WHERE id = ?`)
      .bind(id)
      .run();

    if (!response.success) {
      throw new Error("Failed to unpublish template");
    }

    // Clear relevant caches
    this.connectionManager.clearSpecificCaches([
      `template:${id}`,
      'templates:all:',
      'popular_templates'
    ]);

    return { success: true };
  }

  async getAnalytics(id: number) {
    const cacheKey = `template:analytics:${id}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        // Get basic template stats
        const template = await this.getById(id);
        if (!template) {
          return null;
        }

        // Use parallel queries for analytics
        const [analyticsResult, trendResult] = await Promise.all([
          // Analytics query
          this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.TEMPLATE_ANALYTICS).bind(id).first(),
          // Trend query
          this.connectionManager.prepare(`
            SELECT
              DATE(created_at) as date,
              COUNT(*) as submissions,
              COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
              AVG(calculated_score) as avg_score
            FROM form_submissions
            WHERE template_id = ?
              AND created_at >= date('now', '-30 days')
            GROUP BY DATE(created_at)
            ORDER BY date DESC
          `).bind(id).all()
        ]);

        return {
          template_info: {
            id: template.id,
            name: template.name,
            version: template.version,
            is_published: template.is_published,
            category: template.category,
          },
          statistics: analyticsResult || null,
          trends: trendResult?.success ? trendResult.results : [],
        };
      },
      10 * 60 // 10 minutes cache for analytics
    );
  }

  async getPopularTemplates(limit: number = 10) {
    const cacheKey = `popular_templates:${limit}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.POPULAR_TEMPLATES)
          .bind(limit)
          .all();

        if (response.success) {
          return processTemplateResults(this.connectionManager)(response.results);
        }
        return [];
      },
      30 * 60 // 30 minutes cache for popular templates
    );
  }

  async getCategoryStatistics() {
    const cacheKey = 'category_stats';
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.CATEGORY_STATS).all();

        if (response.success) {
          return response.results;
        }
        return [];
      },
      30 * 60 // 30 minutes cache for category stats
    );
  }

  async bulkCreate(templates: Array<{
    name: string;
    description?: string;
    category: string;
    form_config: object;
    metadata?: object;
    created_by: number;
  }>) {
    // Use batch operations for bulk creation
    const statements = templates.map(template =>
      this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.INSERT_TEMPLATE)
        .bind(
          template.name,
          template.description || null,
          template.category,
          JSON.stringify(template.form_config),
          JSON.stringify(template.metadata || {}),
          template.created_by
        )
    );

    const results = await Promise.all(statements.map(stmt => stmt.run()));
    
    // Clear relevant caches
    this.connectionManager.clearSpecificCaches(['templates:all:', 'popular_templates', 'category_stats']);
    
    return {
      success: true,
      created: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  async getTemplateUsageStats(templateId: number) {
    const cacheKey = `template:usage:${templateId}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const [dailyStats, userStats, scoreDistribution] = await Promise.all([
          // Daily usage stats
          this.connectionManager.prepare(`
            SELECT
              DATE(created_at) as date,
              COUNT(*) as submissions,
              COUNT(DISTINCT customer_id) as unique_users
            FROM form_submissions
            WHERE template_id = ? AND created_at >= date('now', '-7 days')
            GROUP BY DATE(created_at)
            ORDER BY date DESC
          `).bind(templateId).all(),
          
          // User engagement stats
          this.connectionManager.prepare(`
            SELECT
              customer_id,
              COUNT(*) as submission_count,
              AVG(calculated_score) as avg_score,
              MAX(created_at) as last_submission
            FROM form_submissions
            WHERE template_id = ?
            GROUP BY customer_id
            ORDER BY submission_count DESC
            LIMIT 20
          `).bind(templateId).all(),
          
          // Score distribution
          this.connectionManager.prepare(`
            SELECT
              CASE
                WHEN calculated_score < 50 THEN '0-49'
                WHEN calculated_score < 70 THEN '50-69'
                WHEN calculated_score < 85 THEN '70-84'
                WHEN calculated_score < 95 THEN '85-94'
                ELSE '95-100'
              END as score_range,
              COUNT(*) as count
            FROM form_submissions
            WHERE template_id = ? AND calculated_score IS NOT NULL
            GROUP BY score_range
            ORDER BY score_range
          `).bind(templateId).all()
        ]);

        return {
          daily_usage: dailyStats.success ? dailyStats.results : [],
          top_users: userStats.success ? userStats.results : [],
          score_distribution: scoreDistribution.success ? scoreDistribution.results : []
        };
      },
      5 * 60 // 5 minutes cache
    );
  }
}