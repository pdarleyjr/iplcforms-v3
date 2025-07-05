export const FORM_TEMPLATE_QUERIES = {
  BASE_SELECT: `
    SELECT 
      ft.*,
      u.name as created_by_name,
      u.email as created_by_email,
      fc.name as category_name,
      fc.description as category_description,
      COUNT(fs.id) as submission_count
    FROM form_templates ft
    LEFT JOIN users u ON ft.created_by = u.id
    LEFT JOIN form_categories fc ON ft.category_id = fc.id
    LEFT JOIN form_submissions fs ON ft.id = fs.template_id
  `,
  INSERT_TEMPLATE: `
    INSERT INTO form_templates (
      title, description, category_id, form_config, ui_config, 
      scoring_config, status, version, parent_template_id, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  UPDATE_TEMPLATE: `
    UPDATE form_templates 
    SET title = ?, description = ?, category_id = ?, form_config = ?, 
        ui_config = ?, scoring_config = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  DELETE_TEMPLATE: `UPDATE form_templates SET status = 'deleted' WHERE id = ?`,
  GET_BY_ID: `WHERE ft.id = ? GROUP BY ft.id`,
  GET_BY_CATEGORY: `WHERE ft.category_id = ? AND ft.status != 'deleted' GROUP BY ft.id`,
  GET_BY_STATUS: `WHERE ft.status = ? GROUP BY ft.id`,
  GET_VERSIONS: `WHERE ft.parent_template_id = ? OR ft.id = ? GROUP BY ft.id ORDER BY ft.version DESC`,
  SEARCH: `WHERE (ft.title LIKE ? OR ft.description LIKE ?) AND ft.status != 'deleted' GROUP BY ft.id`,
};

const processTemplateResults = (rows: any[]) => {
  return rows.map((row) => {
    const template = { ...row };
    
    // Parse JSON fields
    if (template.form_config) {
      template.form_config = JSON.parse(template.form_config);
    }
    if (template.ui_config) {
      template.ui_config = JSON.parse(template.ui_config);
    }
    if (template.scoring_config) {
      template.scoring_config = JSON.parse(template.scoring_config);
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

    // Add category info
    if (template.category_name) {
      template.category_info = {
        name: template.category_name,
        description: template.category_description,
      };
      delete template.category_name;
      delete template.category_description;
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
    category_id?: number;
    status?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) {
    let query = FORM_TEMPLATE_QUERIES.BASE_SELECT;
    let bindParams: any[] = [];
    
    if (filters?.category_id) {
      query += ` ${FORM_TEMPLATE_QUERIES.GET_BY_CATEGORY}`;
      bindParams.push(filters.category_id);
    } else if (filters?.status) {
      query += ` ${FORM_TEMPLATE_QUERIES.GET_BY_STATUS}`;
      bindParams.push(filters.status);
    } else if (filters?.search) {
      query += ` ${FORM_TEMPLATE_QUERIES.SEARCH}`;
      bindParams.push(`%${filters.search}%`, `%${filters.search}%`);
    } else {
      query += ` WHERE ft.status != 'deleted' GROUP BY ft.id`;
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
    title: string;
    description?: string;
    category_id?: number;
    form_config: object;
    ui_config?: object;
    scoring_config?: object;
    status?: string;
    version?: string;
    parent_template_id?: number;
    created_by: number;
  }) {
    const {
      title,
      description,
      category_id,
      form_config,
      ui_config,
      scoring_config,
      status = 'draft',
      version = '1.0',
      parent_template_id,
      created_by,
    } = templateData;

    const response = await this.DB.prepare(FORM_TEMPLATE_QUERIES.INSERT_TEMPLATE)
      .bind(
        title,
        description || null,
        category_id || null,
        JSON.stringify(form_config),
        JSON.stringify(ui_config || {}),
        JSON.stringify(scoring_config || {}),
        status,
        version,
        parent_template_id || null,
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
    title?: string;
    description?: string;
    category_id?: number;
    form_config?: object;
    ui_config?: object;
    scoring_config?: object;
    status?: string;
  }) {
    // First get the existing template
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error("Template not found");
    }

    const {
      title = existing.title,
      description = existing.description,
      category_id = existing.category_id,
      form_config = existing.form_config,
      ui_config = existing.ui_config,
      scoring_config = existing.scoring_config,
      status = existing.status,
    } = templateData;

    const response = await this.DB.prepare(FORM_TEMPLATE_QUERIES.UPDATE_TEMPLATE)
      .bind(
        title,
        description,
        category_id,
        JSON.stringify(form_config),
        JSON.stringify(ui_config),
        JSON.stringify(scoring_config),
        status,
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
    return this.update(id, { status: 'published' });
  }

  async unpublish(id: number) {
    return this.update(id, { status: 'draft' });
  }

  async createVersion(parentId: number, templateData: {
    title?: string;
    description?: string;
    form_config: object;
    ui_config?: object;
    scoring_config?: object;
    version: string;
    created_by: number;
  }) {
    const parent = await this.getById(parentId);
    if (!parent) {
      throw new Error("Parent template not found");
    }

    return this.create({
      ...templateData,
      title: templateData.title || parent.title,
      description: templateData.description || parent.description,
      category_id: parent.category_id,
      parent_template_id: parentId,
      status: 'draft',
    });
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
        title: template.title,
        version: template.version,
        status: template.status,
      },
      statistics: submissionStats,
      trends: submissionTrend.success ? submissionTrend.results : [],
    };
  }
}