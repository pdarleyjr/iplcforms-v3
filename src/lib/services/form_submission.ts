export const FORM_SUBMISSION_QUERIES = {
  BASE_SELECT: `
    SELECT 
      fs.*,
      ft.title as template_title,
      ft.version as template_version,
      ft.scoring_config as template_scoring_config,
      u.name as submitted_by_name,
      u.email as submitted_by_email,
      p.name as patient_name,
      p.mrn as patient_mrn
    FROM form_submissions fs
    LEFT JOIN form_templates ft ON fs.template_id = ft.id
    LEFT JOIN users u ON fs.submitted_by = u.id
    LEFT JOIN patients p ON fs.patient_id = p.id
  `,
  INSERT_SUBMISSION: `
    INSERT INTO form_submissions (
      template_id, patient_id, responses, status, calculated_score, 
      completion_time_seconds, submitted_by, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  UPDATE_SUBMISSION: `
    UPDATE form_submissions 
    SET responses = ?, status = ?, calculated_score = ?, 
        completion_time_seconds = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  UPDATE_STATUS: `UPDATE form_submissions SET status = ? WHERE id = ?`,
  GET_BY_ID: `WHERE fs.id = ?`,
  GET_BY_TEMPLATE: `WHERE fs.template_id = ?`,
  GET_BY_PATIENT: `WHERE fs.patient_id = ?`,
  GET_BY_STATUS: `WHERE fs.status = ?`,
  GET_BY_DATE_RANGE: `WHERE fs.created_at BETWEEN ? AND ?`,
};

const processSubmissionResults = (rows: any[]) => {
  return rows.map((row) => {
    const submission = { ...row };
    
    // Parse JSON fields
    if (submission.responses) {
      submission.responses = JSON.parse(submission.responses);
    }
    if (submission.metadata) {
      submission.metadata = JSON.parse(submission.metadata);
    }
    if (submission.template_scoring_config) {
      submission.template_scoring_config = JSON.parse(submission.template_scoring_config);
    }

    // Add template info
    if (submission.template_title) {
      submission.template_info = {
        title: submission.template_title,
        version: submission.template_version,
        scoring_config: submission.template_scoring_config,
      };
      delete submission.template_title;
      delete submission.template_version;
      delete submission.template_scoring_config;
    }

    // Add submitter info
    if (submission.submitted_by_name) {
      submission.submitted_by_info = {
        name: submission.submitted_by_name,
        email: submission.submitted_by_email,
      };
      delete submission.submitted_by_name;
      delete submission.submitted_by_email;
    }

    // Add patient info
    if (submission.patient_name) {
      submission.patient_info = {
        name: submission.patient_name,
        mrn: submission.patient_mrn,
      };
      delete submission.patient_name;
      delete submission.patient_mrn;
    }

    return submission;
  });
};

export class FormSubmissionService {
  private DB: D1Database;

  constructor(DB: D1Database) {
    this.DB = DB;
  }

  async getById(id: number) {
    const query = `${FORM_SUBMISSION_QUERIES.BASE_SELECT} ${FORM_SUBMISSION_QUERIES.GET_BY_ID}`;
    const response = await this.DB.prepare(query).bind(id).all();

    if (response.success && response.results.length > 0) {
      const [submission] = processSubmissionResults(response.results);
      return submission;
    }
    return null;
  }

  async getAll(filters?: {
    template_id?: number;
    patient_id?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
  }) {
    let query = FORM_SUBMISSION_QUERIES.BASE_SELECT;
    let bindParams: any[] = [];
    let whereClause = '';
    
    if (filters?.template_id) {
      whereClause = FORM_SUBMISSION_QUERIES.GET_BY_TEMPLATE;
      bindParams.push(filters.template_id);
    } else if (filters?.patient_id) {
      whereClause = FORM_SUBMISSION_QUERIES.GET_BY_PATIENT;
      bindParams.push(filters.patient_id);
    } else if (filters?.status) {
      whereClause = FORM_SUBMISSION_QUERIES.GET_BY_STATUS;
      bindParams.push(filters.status);
    } else if (filters?.date_from && filters?.date_to) {
      whereClause = FORM_SUBMISSION_QUERIES.GET_BY_DATE_RANGE;
      bindParams.push(filters.date_from, filters.date_to);
    }

    if (whereClause) {
      query += ` ${whereClause}`;
    }

    query += ` ORDER BY fs.created_at DESC`;

    // Add pagination
    if (filters?.page && filters?.per_page) {
      const offset = (filters.page - 1) * filters.per_page;
      query += ` LIMIT ? OFFSET ?`;
      bindParams.push(filters.per_page, offset);
    }

    const response = await this.DB.prepare(query).bind(...bindParams).all();

    if (response.success) {
      return processSubmissionResults(response.results);
    }
    return [];
  }

  async create(submissionData: {
    template_id: number;
    patient_id?: number;
    responses: object;
    status?: string;
    completion_time_seconds?: number;
    submitted_by?: number;
    metadata?: object;
  }) {
    const {
      template_id,
      patient_id,
      responses,
      status = 'completed',
      completion_time_seconds,
      submitted_by,
      metadata = {},
    } = submissionData;

    // Calculate score based on template scoring configuration
    const calculated_score = await this.calculateScore(template_id, responses);

    const response = await this.DB.prepare(FORM_SUBMISSION_QUERIES.INSERT_SUBMISSION)
      .bind(
        template_id,
        patient_id || null,
        JSON.stringify(responses),
        status,
        calculated_score,
        completion_time_seconds || null,
        submitted_by || null,
        JSON.stringify(metadata)
      )
      .run();

    if (!response.success) {
      throw new Error("Failed to create form submission");
    }

    const submissionId = response.meta.last_row_id;
    return { success: true, submissionId, calculated_score };
  }

  async update(id: number, submissionData: {
    responses?: object;
    status?: string;
    completion_time_seconds?: number;
    metadata?: object;
  }) {
    // First get the existing submission
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error("Submission not found");
    }

    const {
      responses = existing.responses,
      status = existing.status,
      completion_time_seconds = existing.completion_time_seconds,
      metadata = existing.metadata,
    } = submissionData;

    // Recalculate score if responses changed
    let calculated_score = existing.calculated_score;
    if (submissionData.responses) {
      calculated_score = await this.calculateScore(existing.template_id, responses);
    }

    const response = await this.DB.prepare(FORM_SUBMISSION_QUERIES.UPDATE_SUBMISSION)
      .bind(
        JSON.stringify(responses),
        status,
        calculated_score,
        completion_time_seconds,
        JSON.stringify(metadata),
        id
      )
      .run();

    if (!response.success) {
      throw new Error("Failed to update form submission");
    }

    return { success: true, calculated_score };
  }

  async updateStatus(id: number, status: string) {
    const response = await this.DB.prepare(FORM_SUBMISSION_QUERIES.UPDATE_STATUS)
      .bind(status, id)
      .run();

    if (!response.success) {
      throw new Error("Failed to update submission status");
    }

    return { success: true };
  }

  async calculateScore(templateId: number, responses: object): Promise<number | null> {
    // Get template scoring configuration
    const template = await this.DB.prepare(`
      SELECT scoring_config FROM form_templates WHERE id = ?
    `).bind(templateId).first();

    if (!template || !template.scoring_config || typeof template.scoring_config !== 'string') {
      return null;
    }

    const scoringConfig = JSON.parse(template.scoring_config);
    
    if (!scoringConfig.algorithm) {
      return null;
    }

    switch (scoringConfig.algorithm) {
      case 'sum':
        return this.calculateSumScore(scoringConfig, responses);
      case 'average':
        return this.calculateAverageScore(scoringConfig, responses);
      case 'weighted':
        return this.calculateWeightedScore(scoringConfig, responses);
      case 'custom':
        return this.calculateCustomScore(scoringConfig, responses);
      default:
        return null;
    }
  }

  private calculateSumScore(config: any, responses: any): number {
    let total = 0;
    const components = config.components || [];
    
    for (const component of components) {
      const value = responses[component];
      if (typeof value === 'number') {
        total += value;
      }
    }
    
    return total;
  }

  private calculateAverageScore(config: any, responses: any): number {
    const sum = this.calculateSumScore(config, responses);
    const components = config.components || [];
    return components.length > 0 ? sum / components.length : 0;
  }

  private calculateWeightedScore(config: any, responses: any): number {
    let total = 0;
    let weightSum = 0;
    const weights = config.weights || {};
    
    for (const [component, weight] of Object.entries(weights)) {
      const value = responses[component];
      if (typeof value === 'number' && typeof weight === 'number') {
        total += value * weight;
        weightSum += weight;
      }
    }
    
    return weightSum > 0 ? total / weightSum : 0;
  }

  private calculateCustomScore(config: any, responses: any): number {
    // For custom scoring, we would implement specific algorithms
    // This is a placeholder for custom scoring logic
    if (config.custom_function) {
      // In a real implementation, this might evaluate a safe expression
      // or call a specific scoring function based on the configuration
    }
    return 0;
  }

  async getSubmissionStats(templateId?: number) {
    let query = `
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_submissions,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_submissions,
        AVG(completion_time_seconds) as avg_completion_time,
        AVG(calculated_score) as avg_score,
        MIN(calculated_score) as min_score,
        MAX(calculated_score) as max_score
      FROM form_submissions
    `;
    
    let bindParams: any[] = [];
    if (templateId) {
      query += ` WHERE template_id = ?`;
      bindParams.push(templateId);
    }

    const response = await this.DB.prepare(query).bind(...bindParams).first();
    return response || {};
  }

  async exportSubmissions(templateId: number, format: 'json' | 'csv' = 'json') {
    const submissions = await this.getAll({ template_id: templateId });
    
    if (format === 'csv') {
      return this.convertToCSV(submissions);
    }
    
    return submissions;
  }

  private convertToCSV(submissions: any[]): string {
    if (submissions.length === 0) return '';
    
    // Get all unique response keys for headers
    const responseKeys = new Set<string>();
    submissions.forEach(sub => {
      if (sub.responses) {
        Object.keys(sub.responses).forEach(key => responseKeys.add(key));
      }
    });
    
    const headers = ['id', 'created_at', 'status', 'calculated_score', ...responseKeys];
    const csvRows = [headers.join(',')];
    
    submissions.forEach(sub => {
      const row = [
        sub.id,
        sub.created_at,
        sub.status,
        sub.calculated_score || '',
        ...Array.from(responseKeys).map(key => sub.responses?.[key] || '')
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }
}