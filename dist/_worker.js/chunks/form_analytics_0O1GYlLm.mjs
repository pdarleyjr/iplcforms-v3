globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getD1Manager } from './d1-connection-manager_oVL7uFVJ.mjs';

const ANALYTICS_QUERIES = {
  TEMPLATE_SUBMISSIONS: `
    SELECT 
      COUNT(*) as total_submissions,
      AVG(completion_time_seconds) as avg_completion_time,
      AVG(CASE WHEN status = 'completed' THEN 1.0 ELSE 0.0 END) as completion_rate,
      AVG(score) as avg_score
    FROM form_submissions 
    WHERE template_id = ?
  `,
  SUBMISSION_TRENDS: `
    SELECT 
      DATE(submitted_at) as submission_date,
      COUNT(*) as submission_count
    FROM form_submissions 
    WHERE template_id = ? 
    AND submitted_at >= datetime('now', '-30 days')
    GROUP BY DATE(submitted_at)
    ORDER BY submission_date
  `,
  FIELD_ANALYTICS: `
    SELECT 
      json_extract(responses, '$.field_' || ? || '.value') as field_value,
      json_extract(responses, '$.field_' || ? || '.time_spent') as time_spent,
      COUNT(*) as response_count
    FROM form_submissions 
    WHERE template_id = ?
    AND json_extract(responses, '$.field_' || ?) IS NOT NULL
    GROUP BY field_value
  `,
  PATIENT_OUTCOMES: `
    SELECT 
      submitted_by as patient_id,
      COUNT(*) as submission_count,
      AVG(score) as avg_score,
      MAX(submitted_at) as last_submission,
      MIN(score) as first_score,
      MAX(score) as latest_score
    FROM form_submissions fs
    JOIN form_templates ft ON fs.template_id = ft.id
    WHERE ft.category = 'clinical_assessment'
    AND submitted_by IS NOT NULL
    GROUP BY submitted_by
    HAVING submission_count >= 2
  `,
  CLINICIAN_PERFORMANCE: `
    SELECT 
      ft.created_by as clinician_id,
      COUNT(DISTINCT fs.id) as forms_administered,
      AVG(fs.score) as avg_patient_score,
      AVG(CASE WHEN fs.status = 'completed' THEN 1.0 ELSE 0.0 END) as completion_rate
    FROM form_templates ft
    LEFT JOIN form_submissions fs ON ft.id = fs.template_id
    WHERE ft.created_by IS NOT NULL
    GROUP BY ft.created_by
  `,
  TIME_SERIES_ANALYTICS: `
    SELECT 
      DATE(submitted_at) as date,
      COUNT(*) as submissions,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completions,
      AVG(score) as avg_score,
      AVG(completion_time_seconds) as avg_time
    FROM form_submissions 
    WHERE template_id = ?
    AND submitted_at >= datetime('now', '-' || ? || ' days')
    GROUP BY DATE(submitted_at)
    ORDER BY date
  `,
  RESPONSE_DISTRIBUTION: `
    SELECT 
      status,
      COUNT(*) as count,
      AVG(score) as avg_score
    FROM form_submissions 
    WHERE template_id = ?
    GROUP BY status
  `,
  FIELD_VALIDATION_ERRORS: `
    SELECT COUNT(*) as error_count
    FROM form_submissions
    WHERE template_id = ?
    AND json_extract(metadata, '$.validation_errors.' || ?) IS NOT NULL
  `
};
class FormAnalyticsService {
  d1Manager;
  constructor(DB) {
    this.d1Manager = getD1Manager(DB);
  }
  async getFormAnalytics(templateId) {
    const cacheKey = `form_analytics:${templateId}`;
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const statsStmt = this.d1Manager.prepare(ANALYTICS_QUERIES.TEMPLATE_SUBMISSIONS);
        const statsResponse = await statsStmt.bind(templateId).first();
        const stats = statsResponse || {
          total_submissions: 0,
          avg_completion_time: 0,
          completion_rate: 0,
          avg_score: null
        };
        const trendsStmt = this.d1Manager.prepare(ANALYTICS_QUERIES.SUBMISSION_TRENDS);
        const trendsResponse = await trendsStmt.bind(templateId).all();
        const submissionTrends = trendsResponse.success ? trendsResponse.results.map((row) => ({
          date: row.submission_date,
          count: row.submission_count
        })) : [];
        const templateStmt = this.d1Manager.prepare(`
          SELECT components FROM form_templates WHERE id = ?
        `);
        const template = await templateStmt.bind(templateId).first();
        let fieldAnalytics = [];
        if (template && template.components) {
          const components = this.d1Manager.parseJSON(template.components);
          fieldAnalytics = await this.analyzeFields(templateId, components);
        }
        const responseDistribution = await this.getResponseDistribution(templateId);
        return {
          templateId,
          totalSubmissions: Number(stats.total_submissions) || 0,
          completionRate: Number(stats.completion_rate) || 0,
          averageCompletionTime: Number(stats.avg_completion_time) || 0,
          abandonmentRate: 1 - (Number(stats.completion_rate) || 0),
          averageScore: stats.avg_score ? Number(stats.avg_score) : void 0,
          responseDistribution,
          submissionTrends,
          fieldAnalytics
        };
      },
      600
      // 10-minute cache for analytics data
    );
  }
  async analyzeFields(templateId, components) {
    const fieldAnalysisPromises = [];
    for (const component of components) {
      if (component.type && component.id) {
        fieldAnalysisPromises.push(this.analyzeField(templateId, component));
      }
    }
    const results = await Promise.all(fieldAnalysisPromises);
    return results.filter((result) => result !== null);
  }
  async analyzeField(templateId, component) {
    const cacheKey = `field_analytics:${templateId}:${component.id}`;
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const fieldStmt = this.d1Manager.prepare(ANALYTICS_QUERIES.FIELD_ANALYTICS);
        const fieldResponse = await fieldStmt.bind(component.id, component.id, templateId, component.id).all();
        if (fieldResponse.success && fieldResponse.results.length > 0) {
          const responses = fieldResponse.results;
          const responseCount = responses.reduce((sum, r) => sum + r.response_count, 0);
          let averageValue;
          let mostCommonValue;
          if (component.type === "number" || component.type === "slider") {
            const values = responses.filter((r) => r.field_value !== null && !isNaN(Number(r.field_value))).map((r) => ({ value: Number(r.field_value), count: r.response_count }));
            if (values.length > 0) {
              const totalWeightedSum = values.reduce((sum, v) => sum + v.value * v.count, 0);
              averageValue = totalWeightedSum / responseCount;
            }
          }
          const sortedResponses = responses.sort((a, b) => b.response_count - a.response_count);
          if (sortedResponses.length > 0) {
            mostCommonValue = String(sortedResponses[0].field_value);
          }
          const validationErrors = await this.getFieldValidationErrors(templateId, component.id);
          return {
            fieldId: component.id,
            fieldType: component.type,
            responseCount,
            averageValue,
            mostCommonValue,
            validationErrors
          };
        }
        return null;
      },
      300
      // 5-minute cache for field analytics
    );
  }
  async getFieldValidationErrors(templateId, fieldId) {
    const stmt = this.d1Manager.prepare(ANALYTICS_QUERIES.FIELD_VALIDATION_ERRORS);
    const response = await stmt.bind(templateId, fieldId).first();
    return response && typeof response === "object" && "error_count" in response && typeof response.error_count === "number" ? response.error_count : 0;
  }
  async getResponseDistribution(templateId) {
    const stmt = this.d1Manager.prepare(ANALYTICS_QUERIES.RESPONSE_DISTRIBUTION);
    const response = await stmt.bind(templateId).all();
    const distribution = {};
    if (response.success) {
      response.results.forEach((row) => {
        distribution[row.status] = {
          count: row.count,
          averageScore: row.avg_score
        };
      });
    }
    return distribution;
  }
  async getSubmissionAnalytics(submissionId) {
    const cacheKey = `submission_analytics:${submissionId}`;
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.d1Manager.prepare(`
          SELECT * FROM form_submissions WHERE id = ?
        `);
        const submission = await stmt.bind(submissionId).first();
        if (!submission || typeof submission !== "object") {
          return null;
        }
        const responses = this.d1Manager.parseJSON(submission.responses || "{}");
        const metadata = this.d1Manager.parseJSON(submission.metadata || "{}");
        const fieldResponses = Object.keys(responses).map((fieldId) => {
          const fieldData = responses[fieldId];
          return {
            fieldId: fieldId.replace("field_", ""),
            value: fieldData.value,
            timeSpent: fieldData.time_spent || 0,
            validationErrors: fieldData.validation_errors || 0
          };
        });
        const completionTime = submission.completion_time_seconds || 0;
        const score = submission.score || void 0;
        const userBehavior = {
          totalTimeSpent: completionTime,
          fieldsVisited: fieldResponses.length,
          backtrackCount: metadata.backtrack_count || 0,
          pauseCount: metadata.pause_count || 0
        };
        return {
          submissionId,
          completionTime,
          score,
          fieldResponses,
          userBehavior
        };
      },
      300
      // 5-minute cache for submission analytics
    );
  }
  async getClinicalInsights() {
    const cacheKey = "clinical_insights:all";
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const patientStmt = this.d1Manager.prepare(ANALYTICS_QUERIES.PATIENT_OUTCOMES);
        const patientOutcomesResponse = await patientStmt.all();
        const patientOutcomes = patientOutcomesResponse.success ? patientOutcomesResponse.results.map((row) => {
          const trend = this.calculateTrend(row.first_score, row.latest_score);
          return {
            patientId: row.patient_id,
            submissionCount: row.submission_count,
            averageScore: Number(row.avg_score),
            trend,
            lastSubmission: row.last_submission
          };
        }) : [];
        const clinicianStmt = this.d1Manager.prepare(ANALYTICS_QUERIES.CLINICIAN_PERFORMANCE);
        const clinicianPerformanceResponse = await clinicianStmt.all();
        const clinicianPerformance = clinicianPerformanceResponse.success ? clinicianPerformanceResponse.results.map((row) => ({
          clinicianId: row.clinician_id,
          formsAdministered: row.forms_administered || 0,
          averagePatientScore: Number(row.avg_patient_score) || 0,
          completionRate: Number(row.completion_rate) || 0
        })) : [];
        const treatmentEffectiveness = [];
        return {
          patientOutcomes,
          clinicianPerformance,
          treatmentEffectiveness
        };
      },
      1800
      // 30-minute cache for clinical insights
    );
  }
  calculateTrend(firstScore, latestScore) {
    if (!firstScore || !latestScore) return "stable";
    const difference = latestScore - firstScore;
    const threshold = firstScore * 0.1;
    if (difference > threshold) return "improving";
    if (difference < -threshold) return "declining";
    return "stable";
  }
  async getFormComparisonAnalytics(templateIds) {
    const cacheKey = `form_comparison:${templateIds.sort().join("_")}`;
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const comparisonPromises = [];
        for (const templateId of templateIds) {
          comparisonPromises.push(this.getTemplateComparison(templateId));
        }
        const results = await Promise.all(comparisonPromises);
        return results.filter((result) => result !== null);
      },
      600
      // 10-minute cache for comparison data
    );
  }
  async getTemplateComparison(templateId) {
    const templateStmt = this.d1Manager.prepare(`
      SELECT id, name FROM form_templates WHERE id = ?
    `);
    const template = await templateStmt.bind(templateId).first();
    if (template) {
      const analytics = await this.getFormAnalytics(templateId);
      return {
        templateId,
        templateName: template.name,
        totalSubmissions: analytics.totalSubmissions,
        completionRate: analytics.completionRate,
        averageScore: analytics.averageScore || 0,
        averageCompletionTime: analytics.averageCompletionTime
      };
    }
    return null;
  }
  async getTimeSeriesAnalytics(templateId, days = 30) {
    const cacheKey = `time_series:${templateId}:${days}`;
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.d1Manager.prepare(ANALYTICS_QUERIES.TIME_SERIES_ANALYTICS);
        const response = await stmt.bind(templateId, days).all();
        if (response.success) {
          return response.results.map((row) => ({
            date: row.date,
            submissions: row.submissions || 0,
            completions: row.completions || 0,
            averageScore: Number(row.avg_score) || 0,
            averageTime: Number(row.avg_time) || 0
          }));
        }
        return [];
      },
      300
      // 5-minute cache for time series data
    );
  }
  async exportAnalyticsReport(templateId, format = "json") {
    const analytics = await this.getFormAnalytics(templateId);
    const timeSeriesData = await this.getTimeSeriesAnalytics(templateId);
    const reportData = {
      analytics,
      timeSeriesData,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (format === "csv") {
      return this.convertAnalyticsToCSV(reportData);
    }
    return JSON.stringify(reportData, null, 2);
  }
  convertAnalyticsToCSV(reportData) {
    const { analytics, timeSeriesData } = reportData;
    let csv = "Analytics Report\n\n";
    csv += "Metric,Value\n";
    csv += `Template ID,${analytics.templateId}
`;
    csv += `Total Submissions,${analytics.totalSubmissions}
`;
    csv += `Completion Rate,${analytics.completionRate}
`;
    csv += `Average Completion Time,${analytics.averageCompletionTime}
`;
    csv += `Abandonment Rate,${analytics.abandonmentRate}
`;
    csv += `Average Score,${analytics.averageScore || "N/A"}

`;
    csv += "Time Series Data\n";
    csv += "Date,Submissions,Completions,Average Score,Average Time\n";
    timeSeriesData.forEach((row) => {
      csv += `${row.date},${row.submissions},${row.completions},${row.averageScore},${row.averageTime}
`;
    });
    csv += "\nField Analytics\n";
    csv += "Field ID,Field Type,Response Count,Average Value,Most Common Value,Validation Errors\n";
    analytics.fieldAnalytics.forEach((field) => {
      csv += `${field.fieldId},${field.fieldType},${field.responseCount},${field.averageValue || "N/A"},${field.mostCommonValue || "N/A"},${field.validationErrors}
`;
    });
    return csv;
  }
  // Cache invalidation methods
  clearFormAnalyticsCaches(templateId) {
    const patterns = ["form_analytics:", "field_analytics:", "time_series:", "form_comparison:"];
    if (templateId) {
      patterns.push(`form_analytics:${templateId}`);
      patterns.push(`field_analytics:${templateId}:`);
      patterns.push(`time_series:${templateId}:`);
    }
    this.d1Manager.clearSpecificCaches(patterns);
  }
  clearClinicalInsightsCaches() {
    this.d1Manager.clearSpecificCaches(["clinical_insights:"]);
  }
  clearSubmissionAnalyticsCaches(submissionId) {
    if (submissionId) {
      this.d1Manager.clearSpecificCaches([`submission_analytics:${submissionId}`]);
    } else {
      this.d1Manager.clearSpecificCaches(["submission_analytics:"]);
    }
  }
}

export { FormAnalyticsService as F };
//# sourceMappingURL=form_analytics_0O1GYlLm.mjs.map
