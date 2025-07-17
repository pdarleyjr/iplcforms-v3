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
      name, description, category, subcategory, clinical_context, schema, ui_schema,
      scoring_config, permissions, metadata, tags, clinical_codes, target_audience,
      estimated_completion_time, change_log, collaborators, usage_stats, status,
      created_by, updated_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  UPDATE_TEMPLATE: `
    UPDATE form_templates
    SET name = ?, description = ?, category = ?, subcategory = ?, clinical_context = ?,
        schema = ?, ui_schema = ?, scoring_config = ?, permissions = ?, metadata = ?,
        tags = ?, clinical_codes = ?, target_audience = ?, estimated_completion_time = ?,
        change_log = ?, collaborators = ?, usage_stats = ?, status = ?, updated_by = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  DELETE_TEMPLATE: `UPDATE form_templates SET is_active = false WHERE id = ?`,
  GET_BY_ID: `WHERE ft.id = ? AND ft.is_active = true GROUP BY ft.id`,
  GET_BY_CATEGORY: `WHERE ft.category = ? AND ft.is_active = true GROUP BY ft.id`,
  GET_BY_SUBCATEGORY: `WHERE ft.subcategory = ? AND ft.is_active = true GROUP BY ft.id`,
  GET_BY_STATUS: `WHERE ft.is_published = ? AND ft.is_active = true GROUP BY ft.id`,
  GET_BY_ORGANIZATION: `WHERE ft.created_by IN (SELECT id FROM customers WHERE organization_id = ?) AND ft.is_active = true GROUP BY ft.id`,
  GET_VERSIONS: `WHERE ft.parent_template_id = ? OR ft.id = ? GROUP BY ft.id ORDER BY ft.version DESC`,
  SEARCH: `WHERE (ft.name LIKE ? OR ft.description LIKE ? OR ft.clinical_context LIKE ?) AND ft.is_active = true GROUP BY ft.id`,
  SEARCH_TAGS: `WHERE JSON_EXTRACT(ft.tags, '$') LIKE ? AND ft.is_active = true GROUP BY ft.id`,
  FILTER_BY_TARGET_AUDIENCE: `WHERE JSON_EXTRACT(ft.target_audience, '$') LIKE ? AND ft.is_active = true GROUP BY ft.id`,
  FILTER_BY_COMPLETION_TIME: `WHERE ft.estimated_completion_time <= ? AND ft.is_active = true GROUP BY ft.id`,
  
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
  `,

  // Collection management queries
  CREATE_COLLECTION: `
    INSERT INTO form_template_collections (name, description, created_by, metadata)
    VALUES (?, ?, ?, ?)
  `,
  UPDATE_COLLECTION: `
    UPDATE form_template_collections
    SET name = ?, description = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  DELETE_COLLECTION: `DELETE FROM form_template_collections WHERE id = ?`,
  GET_COLLECTIONS: `
    SELECT
      ftc.*,
      COUNT(ftci.template_id) as template_count
    FROM form_template_collections ftc
    LEFT JOIN form_template_collection_items ftci ON ftc.id = ftci.collection_id
    GROUP BY ftc.id
    ORDER BY ftc.updated_at DESC
  `,
  GET_COLLECTION_BY_ID: `
    SELECT
      ftc.*,
      COUNT(ftci.template_id) as template_count
    FROM form_template_collections ftc
    LEFT JOIN form_template_collection_items ftci ON ftc.id = ftci.collection_id
    WHERE ftc.id = ?
    GROUP BY ftc.id
  `,
  ADD_TEMPLATE_TO_COLLECTION: `
    INSERT INTO form_template_collection_items (collection_id, template_id, added_by)
    VALUES (?, ?, ?)
  `,
  REMOVE_TEMPLATE_FROM_COLLECTION: `
    DELETE FROM form_template_collection_items
    WHERE collection_id = ? AND template_id = ?
  `,
  GET_COLLECTION_TEMPLATES: `
    SELECT
      ft.*,
      c.name as created_by_name,
      c.email as created_by_email,
      ftci.added_at,
      COUNT(fs.id) as submission_count
    FROM form_template_collection_items ftci
    JOIN form_templates ft ON ftci.template_id = ft.id
    LEFT JOIN customers c ON ft.created_by = c.id
    LEFT JOIN form_submissions fs ON ft.id = fs.template_id
    WHERE ftci.collection_id = ? AND ft.is_active = true
    GROUP BY ft.id
    ORDER BY ftci.added_at DESC
  `,

  // Enhanced analytics queries
  GET_FACETS: `
    SELECT
      'categories' as facet_type,
      category as value,
      COUNT(*) as count
    FROM form_templates
    WHERE is_active = true
    GROUP BY category
    UNION ALL
    SELECT
      'subcategories' as facet_type,
      subcategory as value,
      COUNT(*) as count
    FROM form_templates
    WHERE is_active = true AND subcategory IS NOT NULL
    GROUP BY subcategory
    UNION ALL
    SELECT
      'organizations' as facet_type,
      CAST(c.organization_id as TEXT) as value,
      COUNT(*) as count
    FROM form_templates ft
    JOIN customers c ON ft.created_by = c.id
    WHERE ft.is_active = true AND c.organization_id IS NOT NULL
    GROUP BY c.organization_id
  `
};

const processTemplateResults = (connectionManager: D1ConnectionManager) => {
  return (rows: any[]) => {
    return rows.map((row) => {
      const template = { ...row };
      
      // Use optimized JSON parsing for existing fields
      if (template.form_config) {
        template.form_config = connectionManager.parseJSON(template.form_config);
      }
      if (template.metadata) {
        template.metadata = connectionManager.parseJSON(template.metadata);
      }

      // Parse new JSON fields
      if (template.schema) {
        template.schema = connectionManager.parseJSON(template.schema);
      }
      if (template.ui_schema) {
        template.ui_schema = connectionManager.parseJSON(template.ui_schema);
      }
      if (template.scoring_config) {
        template.scoring_config = connectionManager.parseJSON(template.scoring_config);
      }
      if (template.permissions) {
        template.permissions = connectionManager.parseJSON(template.permissions);
      }
      if (template.tags) {
        template.tags = connectionManager.parseJSON(template.tags);
      }
      if (template.clinical_codes) {
        template.clinical_codes = connectionManager.parseJSON(template.clinical_codes);
      }
      if (template.target_audience) {
        template.target_audience = connectionManager.parseJSON(template.target_audience);
      }
      if (template.change_log) {
        template.change_log = connectionManager.parseJSON(template.change_log);
      }
      if (template.collaborators) {
        template.collaborators = connectionManager.parseJSON(template.collaborators);
      }
      if (template.usage_stats) {
        template.usage_stats = connectionManager.parseJSON(template.usage_stats);
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
    subcategory?: string;
    status?: boolean;
    search?: string;
    tags?: string[];
    organization?: number;
    target_audience?: string;
    max_completion_time?: number;
    sort_by?: 'updated_at' | 'created_at' | 'name' | 'submission_count';
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
  }) {
    // Create cache key based on filters
    const cacheKey = `templates:all:${JSON.stringify(filters || {})}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        let query = FORM_TEMPLATE_QUERIES.BASE_SELECT;
        let whereConditions: string[] = ['ft.is_active = true'];
        let bindParams: any[] = [];

        // Build WHERE conditions based on filters
        if (filters?.category) {
          whereConditions.push('ft.category = ?');
          bindParams.push(filters.category);
        }

        if (filters?.subcategory) {
          whereConditions.push('ft.subcategory = ?');
          bindParams.push(filters.subcategory);
        }

        if (filters?.status !== undefined) {
          whereConditions.push('ft.is_published = ?');
          bindParams.push(filters.status);
        }

        if (filters?.search) {
          whereConditions.push('(ft.name LIKE ? OR ft.description LIKE ? OR ft.clinical_context LIKE ?)');
          bindParams.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
        }

        if (filters?.tags && filters.tags.length > 0) {
          const tagConditions = filters.tags.map(() => 'JSON_EXTRACT(ft.tags, "$") LIKE ?').join(' OR ');
          whereConditions.push(`(${tagConditions})`);
          filters.tags.forEach(tag => {
            bindParams.push(`%"${tag}"%`);
          });
        }

        if (filters?.organization) {
          whereConditions.push('ft.created_by IN (SELECT id FROM customers WHERE organization_id = ?)');
          bindParams.push(filters.organization);
        }

        if (filters?.target_audience) {
          whereConditions.push('JSON_EXTRACT(ft.target_audience, "$") LIKE ?');
          bindParams.push(`%"${filters.target_audience}"%`);
        }

        if (filters?.max_completion_time) {
          whereConditions.push('ft.estimated_completion_time <= ?');
          bindParams.push(filters.max_completion_time);
        }

        // Add WHERE clause
        query += ` WHERE ${whereConditions.join(' AND ')} GROUP BY ft.id`;

        // Add sorting
        const sortBy = filters?.sort_by || 'updated_at';
        const sortOrder = filters?.sort_order || 'desc';
        
        if (sortBy === 'submission_count') {
          query += ` ORDER BY submission_count ${sortOrder.toUpperCase()}`;
        } else {
          query += ` ORDER BY ft.${sortBy} ${sortOrder.toUpperCase()}`;
        }

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
    subcategory?: string;
    clinical_context?: string;
    schema?: object;
    ui_schema?: object;
    scoring_config?: object;
    permissions?: object;
    metadata?: object;
    tags?: string[];
    clinical_codes?: object;
    target_audience?: string[];
    estimated_completion_time?: number;
    change_log?: object[];
    collaborators?: object[];
    usage_stats?: object;
    status?: string;
    created_by: number;
    updated_by?: number;
    // Legacy form_config support
    form_config?: object;
  }) {
    const {
      name,
      description,
      category,
      subcategory,
      clinical_context,
      schema,
      ui_schema,
      scoring_config,
      permissions,
      metadata,
      tags,
      clinical_codes,
      target_audience,
      estimated_completion_time,
      change_log,
      collaborators,
      usage_stats,
      status,
      created_by,
      updated_by,
      form_config, // Legacy support
    } = templateData;

    // Use form_config as schema if schema not provided (legacy support)
    const finalSchema = schema || form_config;

    const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.INSERT_TEMPLATE)
      .bind(
        name,
        description || null,
        category,
        subcategory || null,
        clinical_context || null,
        JSON.stringify(finalSchema || {}),
        JSON.stringify(ui_schema || {}),
        JSON.stringify(scoring_config || {}),
        JSON.stringify(permissions || {}),
        JSON.stringify(metadata || {}),
        JSON.stringify(tags || []),
        JSON.stringify(clinical_codes || {}),
        JSON.stringify(target_audience || []),
        estimated_completion_time || null,
        JSON.stringify(change_log || []),
        JSON.stringify(collaborators || []),
        JSON.stringify(usage_stats || {}),
        status || 'draft',
        created_by,
        updated_by || created_by
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
    subcategory?: string;
    clinical_context?: string;
    schema?: object;
    ui_schema?: object;
    scoring_config?: object;
    permissions?: object;
    metadata?: object;
    tags?: string[];
    clinical_codes?: object;
    target_audience?: string[];
    estimated_completion_time?: number;
    change_log?: object[];
    collaborators?: object[];
    usage_stats?: object;
    status?: string;
    updated_by?: number;
    // Legacy form_config support
    form_config?: object;
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
      subcategory = existing.subcategory,
      clinical_context = existing.clinical_context,
      schema = existing.schema,
      ui_schema = existing.ui_schema,
      scoring_config = existing.scoring_config,
      permissions = existing.permissions,
      metadata = existing.metadata,
      tags = existing.tags,
      clinical_codes = existing.clinical_codes,
      target_audience = existing.target_audience,
      estimated_completion_time = existing.estimated_completion_time,
      change_log = existing.change_log,
      collaborators = existing.collaborators,
      usage_stats = existing.usage_stats,
      status = existing.status,
      updated_by,
      form_config, // Legacy support
    } = templateData;

    // Use form_config as schema if provided (legacy support)
    const finalSchema = form_config ? form_config : schema;

    const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.UPDATE_TEMPLATE)
      .bind(
        name,
        description,
        category,
        subcategory,
        clinical_context,
        JSON.stringify(finalSchema),
        JSON.stringify(ui_schema),
        JSON.stringify(scoring_config),
        JSON.stringify(permissions),
        JSON.stringify(metadata),
        JSON.stringify(tags),
        JSON.stringify(clinical_codes),
        JSON.stringify(target_audience),
        estimated_completion_time,
        JSON.stringify(change_log),
        JSON.stringify(collaborators),
        JSON.stringify(usage_stats),
        status,
        updated_by || existing.created_by,
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

  // Collection Management Methods
  async createCollection(collectionData: {
    name: string;
    description?: string;
    created_by: number;
    metadata?: object;
  }) {
    const { name, description, created_by, metadata } = collectionData;

    const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.CREATE_COLLECTION)
      .bind(name, description || null, created_by, JSON.stringify(metadata || {}))
      .run();

    if (!response.success) {
      throw new Error("Failed to create collection");
    }

    return { success: true, collectionId: response.meta.last_row_id };
  }

  async updateCollection(id: number, collectionData: {
    name?: string;
    description?: string;
    metadata?: object;
  }) {
    const { name, description, metadata } = collectionData;

    const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.UPDATE_COLLECTION)
      .bind(name, description, JSON.stringify(metadata), id)
      .run();

    if (!response.success) {
      throw new Error("Failed to update collection");
    }

    return { success: true };
  }

  async deleteCollection(id: number) {
    const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.DELETE_COLLECTION)
      .bind(id)
      .run();

    if (!response.success) {
      throw new Error("Failed to delete collection");
    }

    return { success: true };
  }

  async getCollections() {
    const cacheKey = 'template_collections';
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.GET_COLLECTIONS).all();

        if (response.success) {
          return response.results.map(collection => ({
            ...collection,
            metadata: typeof collection.metadata === 'string' ? this.connectionManager.parseJSON(collection.metadata) : (collection.metadata || {})
          }));
        }
        return [];
      },
      10 * 60 // 10 minutes cache
    );
  }

  async getCollectionById(id: number) {
    const cacheKey = `collection:${id}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.GET_COLLECTION_BY_ID)
          .bind(id)
          .first();

        if (response) {
          return {
            ...response,
            metadata: typeof response.metadata === 'string' ? this.connectionManager.parseJSON(response.metadata) : (response.metadata || {})
          };
        }
        return null;
      },
      10 * 60 // 10 minutes cache
    );
  }

  async addTemplateToCollection(collectionId: number, templateId: number, addedBy: number) {
    const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.ADD_TEMPLATE_TO_COLLECTION)
      .bind(collectionId, templateId, addedBy)
      .run();

    if (!response.success) {
      throw new Error("Failed to add template to collection");
    }

    // Clear collection caches
    this.connectionManager.clearSpecificCaches([
      `collection:${collectionId}`,
      'template_collections'
    ]);

    return { success: true };
  }

  async removeTemplateFromCollection(collectionId: number, templateId: number) {
    const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.REMOVE_TEMPLATE_FROM_COLLECTION)
      .bind(collectionId, templateId)
      .run();

    if (!response.success) {
      throw new Error("Failed to remove template from collection");
    }

    // Clear collection caches
    this.connectionManager.clearSpecificCaches([
      `collection:${collectionId}`,
      'template_collections'
    ]);

    return { success: true };
  }

  async getCollectionTemplates(collectionId: number) {
    const cacheKey = `collection:${collectionId}:templates`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.GET_COLLECTION_TEMPLATES)
          .bind(collectionId)
          .all();

        if (response.success) {
          return processTemplateResults(this.connectionManager)(response.results);
        }
        return [];
      },
      5 * 60 // 5 minutes cache
    );
  }

  // Enhanced Analytics and Faceted Search
  async getFacets() {
    const cacheKey = 'template_facets';
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const response = await this.connectionManager.prepare(FORM_TEMPLATE_QUERIES.GET_FACETS).all();

        if (response.success) {
          const facets: Record<string, Array<{ value: string; count: number }>> = {
            categories: [],
            subcategories: [],
            organizations: []
          };

          response.results.forEach((row: any) => {
            if (row.facet_type && row.value && row.count > 0) {
              facets[row.facet_type] = facets[row.facet_type] || [];
              facets[row.facet_type].push({
                value: row.value,
                count: row.count
              });
            }
          });

          return facets;
        }
        return { categories: [], subcategories: [], organizations: [] };
      },
      15 * 60 // 15 minutes cache for facets
    );
  }

  async getTemplateWithTotalCount(filters?: any) {
    // Get both templates and total count for pagination
    const templates = await this.getAll(filters);
    
    // Get total count without pagination
    const countFilters = { ...filters };
    delete countFilters.page;
    delete countFilters.per_page;
    
    const allTemplates = await this.getAll(countFilters);
    const totalCount = allTemplates.length;

    return {
      templates,
      total_count: totalCount,
      page: filters?.page || 1,
      per_page: filters?.per_page || 20,
      total_pages: Math.ceil(totalCount / (filters?.per_page || 20))
    };
  }

  async updateUsageStats(templateId: number, statsUpdate: {
    views?: number;
    submissions?: number;
    completions?: number;
    avg_completion_time?: number;
  }) {
    const existing = await this.getById(templateId);
    if (!existing) {
      throw new Error("Template not found");
    }

    const currentStats = existing.usage_stats || {};
    const updatedStats = {
      ...currentStats,
      views: (currentStats.views || 0) + (statsUpdate.views || 0),
      submissions: (currentStats.submissions || 0) + (statsUpdate.submissions || 0),
      completions: (currentStats.completions || 0) + (statsUpdate.completions || 0),
      avg_completion_time: statsUpdate.avg_completion_time || currentStats.avg_completion_time,
      last_updated: new Date().toISOString()
    };

    const response = await this.connectionManager.prepare(`
      UPDATE form_templates
      SET usage_stats = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(JSON.stringify(updatedStats), templateId).run();

    if (!response.success) {
      throw new Error("Failed to update usage stats");
    }

    // Clear relevant caches
    this.connectionManager.clearSpecificCaches([
      `template:${templateId}`,
      'templates:all:',
      'popular_templates'
    ]);

    return { success: true };
  }
}