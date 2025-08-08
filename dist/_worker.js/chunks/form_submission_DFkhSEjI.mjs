globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getD1Manager } from './d1-connection-manager_oVL7uFVJ.mjs';
import { F as FormTemplateService } from './form_template_whHHz9qG.mjs';

const FORM_SUBMISSION_QUERIES = {
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
  `
};
const processSubmissionResults = (rows) => {
  return rows.map((row) => {
    const submission = { ...row };
    if (submission.responses) {
      submission.responses = JSON.parse(submission.responses);
    }
    if (submission.metadata) {
      submission.metadata = JSON.parse(submission.metadata);
    }
    if (submission.template_scoring_config) {
      submission.template_scoring_config = JSON.parse(submission.template_scoring_config);
    }
    if (submission.template_title) {
      submission.template_info = {
        title: submission.template_title,
        version: submission.template_version,
        scoring_config: submission.template_scoring_config
      };
      delete submission.template_title;
      delete submission.template_version;
      delete submission.template_scoring_config;
    }
    if (submission.submitted_by_name) {
      submission.submitted_by_info = {
        name: submission.submitted_by_name,
        email: submission.submitted_by_email
      };
      delete submission.submitted_by_name;
      delete submission.submitted_by_email;
    }
    if (submission.patient_name) {
      submission.patient_info = {
        name: submission.patient_name,
        mrn: submission.patient_mrn
      };
      delete submission.patient_name;
      delete submission.patient_mrn;
    }
    return submission;
  });
};
class FormSubmissionService {
  connectionManager;
  templateService;
  constructor(DB) {
    this.connectionManager = getD1Manager(DB);
    this.templateService = new FormTemplateService(DB);
  }
  async getById(id) {
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
      5 * 60 * 1e3
      // 5 minute cache
    );
  }
  async getAll(filters) {
    let query = FORM_SUBMISSION_QUERIES.BASE_SELECT;
    let bindParams = [];
    let whereClause = "";
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
    if (filters?.page && filters?.per_page) {
      const offset = (filters.page - 1) * filters.per_page;
      query += ` LIMIT ? OFFSET ?`;
      bindParams.push(filters.per_page, offset);
    }
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
      2 * 60 * 1e3
      // 2 minute cache for lists
    );
  }
  async create(submissionData) {
    const {
      template_id,
      patient_id,
      responses,
      status = "completed",
      completion_time_seconds,
      submitted_by,
      metadata = {}
    } = submissionData;
    const template = await this.templateService.getById(template_id);
    if (!template) {
      throw new Error("Template not found");
    }
    const visibleResponses = await this.filterResponsesByVisibility(template, responses);
    const calculated_score = await this.calculateScore(template_id, visibleResponses);
    const stmt = this.connectionManager.prepare(FORM_SUBMISSION_QUERIES.INSERT_SUBMISSION);
    const response = await stmt.bind(
      template_id,
      patient_id || null,
      JSON.stringify(visibleResponses),
      status,
      calculated_score,
      completion_time_seconds || null,
      submitted_by || null,
      JSON.stringify(metadata)
    ).run();
    if (!response.success) {
      throw new Error("Failed to create form submission");
    }
    const submissionId = response.meta.last_row_id;
    this.clearSubmissionCaches(template_id);
    return { success: true, submissionId, calculated_score };
  }
  async update(id, submissionData) {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error("Submission not found");
    }
    const {
      responses = existing.responses,
      status = existing.status,
      completion_time_seconds = existing.completion_time_seconds,
      metadata = existing.metadata
    } = submissionData;
    const template = await this.templateService.getById(existing.template_id);
    if (!template) {
      throw new Error("Template not found");
    }
    const visibleResponses = await this.filterResponsesByVisibility(template, responses);
    let calculated_score = existing.calculated_score;
    if (submissionData.responses) {
      calculated_score = await this.calculateScore(existing.template_id, visibleResponses);
    }
    const stmt = this.connectionManager.prepare(FORM_SUBMISSION_QUERIES.UPDATE_SUBMISSION);
    const response = await stmt.bind(
      JSON.stringify(visibleResponses),
      status,
      calculated_score,
      completion_time_seconds,
      JSON.stringify(metadata),
      id
    ).run();
    if (!response.success) {
      throw new Error("Failed to update form submission");
    }
    this.connectionManager.cacheData(`submission_${id}`, null, 0);
    this.clearSubmissionCaches(existing.template_id);
    return { success: true, calculated_score };
  }
  async updateStatus(id, status) {
    const stmt = this.connectionManager.prepare(FORM_SUBMISSION_QUERIES.UPDATE_STATUS);
    const response = await stmt.bind(status, id).run();
    if (!response.success) {
      throw new Error("Failed to update submission status");
    }
    this.connectionManager.cacheData(`submission_${id}`, null, 0);
    const submission = await this.getById(id);
    if (submission) {
      this.clearSubmissionCaches(submission.template_id);
    }
    return { success: true };
  }
  async calculateScore(templateId, responses) {
    const cacheKey = `template_scoring_${templateId}`;
    const template = await this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.connectionManager.prepare(`
          SELECT scoring_config FROM form_templates WHERE id = ?
        `);
        return await stmt.bind(templateId).first();
      },
      10 * 60 * 1e3
      // 10 minute cache for scoring config
    );
    if (!template || !template.scoring_config || typeof template.scoring_config !== "string") {
      return null;
    }
    const scoringConfig = JSON.parse(template.scoring_config);
    if (!scoringConfig.algorithm) {
      return null;
    }
    switch (scoringConfig.algorithm) {
      case "sum":
        return this.calculateSumScore(scoringConfig, responses);
      case "average":
        return this.calculateAverageScore(scoringConfig, responses);
      case "weighted":
        return this.calculateWeightedScore(scoringConfig, responses);
      case "custom":
        return this.calculateCustomScore(scoringConfig, responses);
      default:
        return null;
    }
  }
  calculateSumScore(config, responses) {
    let total = 0;
    const components = config.components || [];
    for (const component of components) {
      const value = responses[component];
      if (typeof value === "number") {
        total += value;
      }
    }
    return total;
  }
  calculateAverageScore(config, responses) {
    const sum = this.calculateSumScore(config, responses);
    const components = config.components || [];
    return components.length > 0 ? sum / components.length : 0;
  }
  calculateWeightedScore(config, responses) {
    let total = 0;
    let weightSum = 0;
    const weights = config.weights || {};
    for (const [component, weight] of Object.entries(weights)) {
      const value = responses[component];
      if (typeof value === "number" && typeof weight === "number") {
        total += value * weight;
        weightSum += weight;
      }
    }
    return weightSum > 0 ? total / weightSum : 0;
  }
  calculateCustomScore(config, responses) {
    if (config.custom_function) ;
    return 0;
  }
  async getSubmissionStats(templateId) {
    const cacheKey = templateId ? `submission_stats_${templateId}` : "submission_stats_all";
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        let query = FORM_SUBMISSION_QUERIES.SUBMISSION_ANALYTICS;
        let bindParams = [];
        if (templateId) {
          query += ` WHERE template_id = ?`;
          bindParams.push(templateId);
        }
        const stmt = this.connectionManager.prepare(query);
        const response = await stmt.bind(...bindParams).first();
        return response || {};
      },
      5 * 60 * 1e3
      // 5 minute cache for analytics
    );
  }
  async exportSubmissions(templateId, format = "json") {
    const submissions = await this.getAll({ template_id: templateId });
    if (format === "csv") {
      return this.convertToCSV(submissions);
    }
    return submissions;
  }
  async bulkCreate(submissions) {
    if (submissions.length === 0) return { success: true, submissionIds: [] };
    const preparedSubmissions = await Promise.all(
      submissions.map(async (sub) => {
        const calculated_score = await this.calculateScore(sub.template_id, sub.responses);
        return {
          ...sub,
          calculated_score,
          responses: JSON.stringify(sub.responses),
          metadata: JSON.stringify(sub.metadata || {}),
          status: sub.status || "completed"
        };
      })
    );
    const results = await this.connectionManager.bulkInsert(
      "form_submissions",
      preparedSubmissions,
      [
        "template_id",
        "patient_id",
        "responses",
        "status",
        "calculated_score",
        "completion_time_seconds",
        "submitted_by",
        "metadata"
      ]
    );
    const submissionIds = results.filter((r) => r.success).map((r) => r.meta.last_row_id);
    const uniqueTemplateIds = [...new Set(submissions.map((s) => s.template_id))];
    uniqueTemplateIds.forEach((templateId) => this.clearSubmissionCaches(templateId));
    return { success: true, submissionIds };
  }
  async getSubmissionsWithStats(filters) {
    const cacheKey = `submissions_with_stats_${JSON.stringify(filters || {})}`;
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        let query = FORM_SUBMISSION_QUERIES.GET_SUBMISSIONS_WITH_STATS;
        let bindParams = [];
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
      2 * 60 * 1e3
      // 2 minute cache
    );
  }
  clearSubmissionCaches(templateId) {
    const patterns = ["submissions_", "submission_stats"];
    if (templateId) {
      patterns.push(`template_${templateId}`);
    }
    this.connectionManager.clearSpecificCaches(patterns);
  }
  async healthCheck() {
    return this.connectionManager.healthCheck();
  }
  getCacheStats() {
    return this.connectionManager.getCacheStats();
  }
  convertToCSV(submissions) {
    if (submissions.length === 0) return "";
    const responseKeys = /* @__PURE__ */ new Set();
    submissions.forEach((sub) => {
      if (sub.responses) {
        Object.keys(sub.responses).forEach((key) => responseKeys.add(key));
      }
    });
    const headers = ["id", "created_at", "status", "calculated_score", ...responseKeys];
    const csvRows = [headers.join(",")];
    submissions.forEach((sub) => {
      const row = [
        sub.id,
        sub.created_at,
        sub.status,
        sub.calculated_score || "",
        ...Array.from(responseKeys).map((key) => sub.responses?.[key] || "")
      ];
      csvRows.push(row.join(","));
    });
    return csvRows.join("\n");
  }
  async filterResponsesByVisibility(template, responses) {
    if (!template.schema || !template.schema.components) {
      return responses;
    }
    const components = template.schema.components;
    const filteredResponses = {};
    const evaluateCondition = (condition) => {
      if (!condition || !condition.field || !condition.operator) {
        return true;
      }
      const triggerValue = responses[condition.field];
      const targetValue = condition.value;
      switch (condition.operator) {
        case "equals":
          return triggerValue === targetValue;
        case "not_equals":
          return triggerValue !== targetValue;
        case "contains":
          return String(triggerValue).includes(String(targetValue));
        case "greater_than":
          return Number(triggerValue) > Number(targetValue);
        case "less_than":
          return Number(triggerValue) < Number(targetValue);
        default:
          return true;
      }
    };
    for (const component of components) {
      const fieldId = component.id;
      if (!(fieldId in responses)) {
        continue;
      }
      if (component.props?.visibilityCondition) {
        const isVisible = evaluateCondition(component.props.visibilityCondition);
        if (isVisible) {
          filteredResponses[fieldId] = responses[fieldId];
        }
      } else {
        filteredResponses[fieldId] = responses[fieldId];
      }
    }
    return filteredResponses;
  }
}

export { FormSubmissionService as F };
//# sourceMappingURL=form_submission_DFkhSEjI.mjs.map
