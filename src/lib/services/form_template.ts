import type { D1Database } from '@cloudflare/workers-types';

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
};

const processTemplateResults = (rows: any[]) => {
  return rows.map((row) => {
    const template = { ...row };
    
    // Parse JSON fields
    if (template.form_config) {
      template.form_config = JSON.parse(template.form_config);
    }
    if (template.metadata) {
      template.metadata = JSON.parse(template.metadata);
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

export class FormTemplateService {
  private DB: D1Database;

  constructor(DB: D1Database) {
    this.DB = DB;
  }

  async getById(id: number) {
    const query = `${FORM_TEMPLATE_QUERIES.BASE_SELECT} ${FORM_TEMPLATE_QUERIES.GET_BY_ID}`;
    const response = await this.DB.prepare(query).bind(id).all();

    if (response.success && response.results.length > 0) {
      const [template] = processTemplateResults(response.results);
      return template;
    }
    return null;
  }

  async getAll(filters?: {
    category?: string;
    status?: boolean;
    search?: string;
    page?: number;
    per_page?: number;
  }) {
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

    const response = await this.DB.prepare(query).bind(...bindParams).all();

    if (response.success) {
      return processTemplateResults(response.results);
    }
    return [];
  }

  async getVersions(templateId: number) {
    const query = `${FORM_TEMPLATE_QUERIES.BASE_SELECT} ${FORM_TEMPLATE_QUERIES.GET_VERSIONS}`;
    const response = await this.DB.prepare(query).bind(templateId, templateId).all();

    if (response.success) {
      return processTemplateResults(response.results);
    }
    return [];
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

    const response = await this.DB.prepare(FORM_TEMPLATE_QUERIES.INSERT_TEMPLATE)
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

    const response = await this.DB.prepare(FORM_TEMPLATE_QUERIES.UPDATE_TEMPLATE)
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

    return { success: true };
  }

  async delete(id: number) {
    const response = await this.DB.prepare(FORM_TEMPLATE_QUERIES.DELETE_TEMPLATE)
      .bind(id)
      .run();

    if (!response.success) {
      throw new Error("Failed to delete form template");
    }

    return { success: true };
  }

  async publish(id: number) {
    const response = await this.DB.prepare(`UPDATE form_templates SET is_published = true WHERE id = ?`)
      .bind(id)
      .run();

    if (!response.success) {
      throw new Error("Failed to publish template");
    }

    return { success: true };
  }

  async unpublish(id: number) {
    const response = await this.DB.prepare(`UPDATE form_templates SET is_published = false WHERE id = ?`)
      .bind(id)
      .run();

    if (!response.success) {
      throw new Error("Failed to unpublish template");
    }

    return { success: true };
  }

  async getAnalytics(id: number) {
    // Get basic template stats
    const template = await this.getById(id);
    if (!template) {
      return null;
    }

    // Get submission statistics
    const submissionStats = await this.DB.prepare(`
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_submissions,
        AVG(completion_time_seconds) as avg_completion_time,
        AVG(calculated_score) as avg_score
      FROM form_submissions 
      WHERE template_id = ?
    `).bind(id).first();

    // Get submissions over time (last 30 days)
    const submissionTrend = await this.DB.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as submissions
      FROM form_submissions 
      WHERE template_id = ? 
        AND created_at >= date('now', '-30 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `).bind(id).all();

    return {
      template_info: {
        id: template.id,
        name: template.name,
        version: template.version,
        is_published: template.is_published,
      },
      statistics: submissionStats,
      trends: submissionTrend.success ? submissionTrend.results : [],
    };
  }
}