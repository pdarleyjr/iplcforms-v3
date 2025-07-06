import type { D1Database } from '@cloudflare/workers-types';
import { D1ConnectionManager, getD1Manager } from './d1-connection-manager';

export const FORM_SUBMISSION_QUERIES = {
  // Optimized: Reduced JOIN complexity, added indexes hint
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
  UPDATE_STATUS: `UPDATE form_submissions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
  GET_BY_ID: `WHERE fs.id = ?`,
  GET_BY_TEMPLATE: `WHERE fs.template_id = ?`,
  GET_BY_PATIENT: `WHERE fs.patient_id = ?`,
  GET_BY_STATUS: `WHERE fs.status = ?`,
  GET_BY_DATE_RANGE: `WHERE fs.created_at BETWEEN ? AND ?`,
  // Optimized: Analytics query combining multiple metrics
  SUBMISSION_ANALYTICS: `
    SELECT
      COUNT(*) as total_submissions,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_submissions,
      COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_submissions,
      COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress_submissions,
      AVG(completion_time_seconds) as avg_completion_time,
      AVG(calculated_score) as avg_score,
      MIN(calculated_score) as min_score,
      MAX(calculated_score) as max_score,
      COUNT(DISTINCT submitted_by) as unique_submitters
    FROM form_submissions
  `,
  // Optimized: Batch submission data with template info
  GET_SUBMISSIONS_WITH_STATS: `
    SELECT
      fs.*,
      ft.title as template_title,
      ft.category as template_category,
      COUNT(*) OVER(PARTITION BY fs.template_id) as template_submission_count,
      AVG(fs.calculated_score) OVER(PARTITION BY fs.template_id) as template_avg_score
    FROM form_submissions fs
    LEFT JOIN form_templates ft ON fs.template_id = ft.id
  `,
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
  private connectionManager: D1ConnectionManager;

  constructor(DB: D1Database) {
    this.connectionManager = getD1Manager(DB);
  }

  async getById(id: number) {
    const cacheKey = `submission_${id}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${FORM_SUBMISSION_QUERIES.BASE_SELECT} ${FORM_SUBMISSION_QUERIES.GET_BY_ID}`;
        const stmt = this.connectionManager.prepare(query);
        const response = await stmt.bind(id).all();

        if (response.success && response.results.length > 0) {
          const [submission] = processSubmissionResults(response.results);
          return submission;
        }
        return null;
      },
      5 * 60 * 1000 // 5 minute cache
    );
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

    // Cache key for filtered results
    const cacheKey = `submissions_${JSON.stringify(filters || {})}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.connectionManager.prepare(query);
        const response = await stmt.bind(...bindParams).all();

        if (response.success) {
          return processSubmissionResults(response.results);
        }
        return [];
      },
      2 * 60 * 1000 // 2 minute cache for lists
    );
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

    const stmt = this.connectionManager.prepare(FORM_SUBMISSION_QUERIES.INSERT_SUBMISSION);
    const response = await stmt
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
    
    // Clear relevant caches
    this.clearSubmissionCaches(template_id);
    
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

    const stmt = this.connectionManager.prepare(FORM_SUBMISSION_QUERIES.UPDATE_SUBMISSION);
    const response = await stmt
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

    // Clear specific submission cache and related caches
    this.connectionManager.cacheData(`submission_${id}`, null, 0);
    this.clearSubmissionCaches(existing.template_id);
    
    return { success: true, calculated_score };
  }

  async updateStatus(id: number, status: string) {
    const stmt = this.connectionManager.prepare(FORM_SUBMISSION_QUERIES.UPDATE_STATUS);
    const response = await stmt
      .bind(status, id)
      .run();

    if (!response.success) {
      throw new Error("Failed to update submission status");
    }

    // Clear submission cache
    this.connectionManager.cacheData(`submission_${id}`, null, 0);
    
    // Get submission to clear template-specific caches
    const submission = await this.getById(id);
    if (submission) {
      this.clearSubmissionCaches(submission.template_id);
    }

    return { success: true };
  }

  async calculateScore(templateId: number, responses: object): Promise<number | null> {
    const cacheKey = `template_scoring_${templateId}`;
    
    // Get template scoring configuration with caching
    const template = await this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.connectionManager.prepare(`
          SELECT scoring_config FROM form_templates WHERE id = ?
        `);
        return await stmt.bind(templateId).first();
      },
      10 * 60 * 1000 // 10 minute cache for scoring config
    );

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
    const cacheKey = templateId ? `submission_stats_${templateId}` : 'submission_stats_all';
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        let query = FORM_SUBMISSION_QUERIES.SUBMISSION_ANALYTICS;
        
        let bindParams: any[] = [];
        if (templateId) {
          query += ` WHERE template_id = ?`;
          bindParams.push(templateId);
        }

        const stmt = this.connectionManager.prepare(query);
        const response = await stmt.bind(...bindParams).first();
        return response || {};
      },
      5 * 60 * 1000 // 5 minute cache for analytics
    );
  }

  async exportSubmissions(templateId: number, format: 'json' | 'csv' = 'json') {
    const submissions = await this.getAll({ template_id: templateId });
    
    if (format === 'csv') {
      return this.convertToCSV(submissions);
    }
    
    return submissions;
  }

  async bulkCreate(submissions: Array<{
    template_id: number;
    patient_id?: number;
    responses: object;
    status?: string;
    completion_time_seconds?: number;
    submitted_by?: number;
    metadata?: object;
  }>) {
    if (submissions.length === 0) return { success: true, submissionIds: [] };

    // Prepare all submissions with calculated scores
    const preparedSubmissions = await Promise.all(
      submissions.map(async (sub) => {
        const calculated_score = await this.calculateScore(sub.template_id, sub.responses);
        return {
          ...sub,
          calculated_score,
          responses: JSON.stringify(sub.responses),
          metadata: JSON.stringify(sub.metadata || {}),
          status: sub.status || 'completed'
        };
      })
    );

    // Bulk insert using connectionManager
    const results = await this.connectionManager.bulkInsert(
      'form_submissions',
      preparedSubmissions,
      ['template_id', 'patient_id', 'responses', 'status', 'calculated_score',
       'completion_time_seconds', 'submitted_by', 'metadata']
    );

    const submissionIds = results
      .filter(r => r.success)
      .map(r => r.meta.last_row_id);

    // Clear relevant caches
    const uniqueTemplateIds = [...new Set(submissions.map(s => s.template_id))];
    uniqueTemplateIds.forEach(templateId => this.clearSubmissionCaches(templateId));

    return { success: true, submissionIds };
  }

  async getSubmissionsWithStats(filters?: {
    template_id?: number;
    limit?: number;
  }) {
    const cacheKey = `submissions_with_stats_${JSON.stringify(filters || {})}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        let query = FORM_SUBMISSION_QUERIES.GET_SUBMISSIONS_WITH_STATS;
        let bindParams: any[] = [];
        
        if (filters?.template_id) {
          query += ` WHERE fs.template_id = ?`;
          bindParams.push(filters.template_id);
        }
        
        query += ` ORDER BY fs.created_at DESC`;
        
        if (filters?.limit) {
          query += ` LIMIT ?`;
          bindParams.push(filters.limit);
        }

        const stmt = this.connectionManager.prepare(query);
        const response = await stmt.bind(...bindParams).all();

        if (response.success) {
          return processSubmissionResults(response.results);
        }
        return [];
      },
      2 * 60 * 1000 // 2 minute cache
    );
  }

  private clearSubmissionCaches(templateId?: number) {
    // Clear list caches that would be affected
    const patterns = ['submissions_', 'submission_stats'];
    if (templateId) {
      patterns.push(`template_${templateId}`);
    }
    this.connectionManager.clearSpecificCaches(patterns);
  }

  async healthCheck(): Promise<boolean> {
    return this.connectionManager.healthCheck();
  }

  getCacheStats() {
    return this.connectionManager.getCacheStats();
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