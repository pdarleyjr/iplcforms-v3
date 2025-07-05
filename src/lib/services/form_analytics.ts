export interface FormAnalytics {
  templateId: number;
  totalSubmissions: number;
  completionRate: number;
  averageCompletionTime: number;
  abandonmentRate: number;
  averageScore?: number;
  responseDistribution: Record<string, any>;
  submissionTrends: Array<{
    date: string;
    count: number;
  }>;
  fieldAnalytics: Array<{
    fieldId: string;
    fieldType: string;
    responseCount: number;
    averageValue?: number;
    mostCommonValue?: string;
    validationErrors: number;
  }>;
}

export interface SubmissionAnalytics {
  submissionId: number;
  completionTime: number;
  score?: number;
  fieldResponses: Array<{
    fieldId: string;
    value: any;
    timeSpent: number;
    validationErrors: number;
  }>;
  userBehavior: {
    totalTimeSpent: number;
    fieldsVisited: number;
    backtrackCount: number;
    pauseCount: number;
  };
}

export interface ClinicalInsights {
  patientOutcomes: Array<{
    patientId: number;
    submissionCount: number;
    averageScore: number;
    trend: 'improving' | 'stable' | 'declining';
    lastSubmission: string;
  }>;
  clinicianPerformance: Array<{
    clinicianId: number;
    formsAdministered: number;
    averagePatientScore: number;
    completionRate: number;
  }>;
  treatmentEffectiveness: Array<{
    treatmentType: string;
    patientCount: number;
    averageImprovement: number;
    successRate: number;
  }>;
}

export const ANALYTICS_QUERIES = {
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
  VALIDATION_ERRORS: `
    SELECT 
      json_extract(metadata, '$.validation_errors') as validation_errors,
      COUNT(*) as error_count
    FROM form_submissions 
    WHERE template_id = ?
    AND json_extract(metadata, '$.validation_errors') IS NOT NULL
    GROUP BY validation_errors
  `,
};

export class FormAnalyticsService {
  private DB: D1Database;

  constructor(DB: D1Database) {
    this.DB = DB;
  }

  async getFormAnalytics(templateId: number): Promise<FormAnalytics> {
    // Get basic submission statistics
    const statsResponse = await this.DB.prepare(ANALYTICS_QUERIES.TEMPLATE_SUBMISSIONS)
      .bind(templateId)
      .first();

    const stats = statsResponse || {
      total_submissions: 0,
      avg_completion_time: 0,
      completion_rate: 0,
      avg_score: null
    };

    // Get submission trends
    const trendsResponse = await this.DB.prepare(ANALYTICS_QUERIES.SUBMISSION_TRENDS)
      .bind(templateId)
      .all();

    const submissionTrends = trendsResponse.success 
      ? trendsResponse.results.map((row: any) => ({
          date: row.submission_date,
          count: row.submission_count
        }))
      : [];

    // Get template structure for field analysis
    const template = await this.DB.prepare(`
      SELECT components FROM form_templates WHERE id = ?
    `).bind(templateId).first();

    let fieldAnalytics: any[] = [];
    if (template && template.components) {
      const components = typeof template.components === 'string' 
        ? JSON.parse(template.components) 
        : template.components;
      
      fieldAnalytics = await this.analyzeFields(templateId, components);
    }

    // Calculate response distribution
    const responseDistribution = await this.getResponseDistribution(templateId);

    return {
      templateId,
      totalSubmissions: Number(stats.total_submissions) || 0,
      completionRate: Number(stats.completion_rate) || 0,
      averageCompletionTime: Number(stats.avg_completion_time) || 0,
      abandonmentRate: 1 - (Number(stats.completion_rate) || 0),
      averageScore: stats.avg_score ? Number(stats.avg_score) : undefined,
      responseDistribution,
      submissionTrends,
      fieldAnalytics,
    };
  }

  private async analyzeFields(templateId: number, components: any[]): Promise<any[]> {
    const fieldAnalytics: any[] = [];

    for (const component of components) {
      if (component.type && component.id) {
        const fieldResponse = await this.DB.prepare(ANALYTICS_QUERIES.FIELD_ANALYTICS)
          .bind(component.id, component.id, templateId, component.id)
          .all();

        if (fieldResponse.success && fieldResponse.results.length > 0) {
          const responses = fieldResponse.results;
          const responseCount = responses.reduce((sum: number, r: any) => sum + r.response_count, 0);
          
          // Calculate field-specific metrics
          let averageValue: number | undefined;
          let mostCommonValue: string | undefined;

          if (component.type === 'number' || component.type === 'slider') {
            const values = responses
              .filter((r: any) => r.field_value !== null && !isNaN(Number(r.field_value)))
              .map((r: any) => ({ value: Number(r.field_value), count: r.response_count }));
            
            if (values.length > 0) {
              const totalWeightedSum = values.reduce((sum, v) => sum + (v.value * v.count), 0);
              averageValue = totalWeightedSum / responseCount;
            }
          }

          // Find most common value
          const sortedResponses = responses.sort((a: any, b: any) => b.response_count - a.response_count);
          if (sortedResponses.length > 0) {
            mostCommonValue = String(sortedResponses[0].field_value);
          }

          // Get validation errors for this field
          const validationErrors = await this.getFieldValidationErrors(templateId, component.id);

          fieldAnalytics.push({
            fieldId: component.id,
            fieldType: component.type,
            responseCount,
            averageValue,
            mostCommonValue,
            validationErrors,
          });
        }
      }
    }

    return fieldAnalytics;
  }

  private async getFieldValidationErrors(templateId: number, fieldId: string): Promise<number> {
    const response = await this.DB.prepare(`
      SELECT COUNT(*) as error_count
      FROM form_submissions
      WHERE template_id = ?
      AND json_extract(metadata, '$.validation_errors.' || ?) IS NOT NULL
    `).bind(templateId, fieldId).first();

    return (response && typeof response === 'object' && 'error_count' in response && typeof response.error_count === 'number')
      ? response.error_count : 0;
  }

  private async getResponseDistribution(templateId: number): Promise<Record<string, any>> {
    const response = await this.DB.prepare(`
      SELECT 
        status,
        COUNT(*) as count,
        AVG(score) as avg_score
      FROM form_submissions 
      WHERE template_id = ?
      GROUP BY status
    `).bind(templateId).all();

    const distribution: Record<string, any> = {};
    
    if (response.success) {
      response.results.forEach((row: any) => {
        distribution[row.status] = {
          count: row.count,
          averageScore: row.avg_score
        };
      });
    }

    return distribution;
  }

  async getSubmissionAnalytics(submissionId: number): Promise<SubmissionAnalytics | null> {
    const submission = await this.DB.prepare(`
      SELECT * FROM form_submissions WHERE id = ?
    `).bind(submissionId).first();

    if (!submission || typeof submission !== 'object') {
      return null;
    }

    // Parse responses and metadata with proper type checking
    const responses = (submission as any).responses && typeof (submission as any).responses === 'string'
      ? JSON.parse((submission as any).responses) : {};
    const metadata = (submission as any).metadata && typeof (submission as any).metadata === 'string'
      ? JSON.parse((submission as any).metadata) : {};

    // Analyze field responses
    const fieldResponses = Object.keys(responses).map(fieldId => {
      const fieldData = responses[fieldId];
      return {
        fieldId: fieldId.replace('field_', ''),
        value: fieldData.value,
        timeSpent: fieldData.time_spent || 0,
        validationErrors: fieldData.validation_errors || 0,
      };
    });

    // Get completion time with proper type checking
    const completionTime = 'completion_time_seconds' in submission && typeof (submission as any).completion_time_seconds === 'number'
      ? (submission as any).completion_time_seconds : 0;

    // Get score with proper type checking
    const score = 'score' in submission && typeof (submission as any).score === 'number'
      ? (submission as any).score : undefined;

    // Calculate user behavior metrics
    const userBehavior = {
      totalTimeSpent: completionTime,
      fieldsVisited: fieldResponses.length,
      backtrackCount: metadata.backtrack_count || 0,
      pauseCount: metadata.pause_count || 0,
    };

    return {
      submissionId,
      completionTime,
      score,
      fieldResponses,
      userBehavior,
    };
  }

  async getClinicalInsights(): Promise<ClinicalInsights> {
    // Get patient outcomes
    const patientOutcomesResponse = await this.DB.prepare(ANALYTICS_QUERIES.PATIENT_OUTCOMES).all();
    const patientOutcomes = patientOutcomesResponse.success 
      ? patientOutcomesResponse.results.map((row: any) => {
          const trend = this.calculateTrend(row.first_score, row.latest_score);
          return {
            patientId: row.patient_id,
            submissionCount: row.submission_count,
            averageScore: Number(row.avg_score),
            trend,
            lastSubmission: row.last_submission,
          };
        })
      : [];

    // Get clinician performance
    const clinicianPerformanceResponse = await this.DB.prepare(ANALYTICS_QUERIES.CLINICIAN_PERFORMANCE).all();
    const clinicianPerformance = clinicianPerformanceResponse.success
      ? clinicianPerformanceResponse.results.map((row: any) => ({
          clinicianId: row.clinician_id,
          formsAdministered: row.forms_administered || 0,
          averagePatientScore: Number(row.avg_patient_score) || 0,
          completionRate: Number(row.completion_rate) || 0,
        }))
      : [];

    // Get treatment effectiveness (placeholder - would need treatment data)
    const treatmentEffectiveness: any[] = [];

    return {
      patientOutcomes,
      clinicianPerformance,
      treatmentEffectiveness,
    };
  }

  private calculateTrend(firstScore: number, latestScore: number): 'improving' | 'stable' | 'declining' {
    if (!firstScore || !latestScore) return 'stable';
    
    const difference = latestScore - firstScore;
    const threshold = firstScore * 0.1; // 10% threshold

    if (difference > threshold) return 'improving';
    if (difference < -threshold) return 'declining';
    return 'stable';
  }

  async getFormComparisonAnalytics(templateIds: number[]): Promise<Array<{
    templateId: number;
    templateName: string;
    totalSubmissions: number;
    completionRate: number;
    averageScore: number;
    averageCompletionTime: number;
  }>> {
    const comparisons: any[] = [];

    for (const templateId of templateIds) {
      const template = await this.DB.prepare(`
        SELECT id, name FROM form_templates WHERE id = ?
      `).bind(templateId).first();

      if (template) {
        const analytics = await this.getFormAnalytics(templateId);
        
        comparisons.push({
          templateId,
          templateName: template.name,
          totalSubmissions: analytics.totalSubmissions,
          completionRate: analytics.completionRate,
          averageScore: analytics.averageScore || 0,
          averageCompletionTime: analytics.averageCompletionTime,
        });
      }
    }

    return comparisons;
  }

  async getTimeSeriesAnalytics(templateId: number, days: number = 30): Promise<Array<{
    date: string;
    submissions: number;
    completions: number;
    averageScore: number;
    averageTime: number;
  }>> {
    const response = await this.DB.prepare(`
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
    `).bind(templateId, days).all();

    if (response.success) {
      return response.results.map((row: any) => ({
        date: row.date,
        submissions: row.submissions || 0,
        completions: row.completions || 0,
        averageScore: Number(row.avg_score) || 0,
        averageTime: Number(row.avg_time) || 0,
      }));
    }

    return [];
  }

  async exportAnalyticsReport(templateId: number, format: 'json' | 'csv' = 'json'): Promise<string> {
    const analytics = await this.getFormAnalytics(templateId);
    const timeSeriesData = await this.getTimeSeriesAnalytics(templateId);

    const reportData = {
      analytics,
      timeSeriesData,
      generatedAt: new Date().toISOString(),
    };

    if (format === 'csv') {
      return this.convertAnalyticsToCSV(reportData);
    }

    return JSON.stringify(reportData, null, 2);
  }

  private convertAnalyticsToCSV(reportData: any): string {
    const { analytics, timeSeriesData } = reportData;
    
    let csv = 'Analytics Report\n\n';
    csv += 'Metric,Value\n';
    csv += `Template ID,${analytics.templateId}\n`;
    csv += `Total Submissions,${analytics.totalSubmissions}\n`;
    csv += `Completion Rate,${analytics.completionRate}\n`;
    csv += `Average Completion Time,${analytics.averageCompletionTime}\n`;
    csv += `Abandonment Rate,${analytics.abandonmentRate}\n`;
    csv += `Average Score,${analytics.averageScore || 'N/A'}\n\n`;

    csv += 'Time Series Data\n';
    csv += 'Date,Submissions,Completions,Average Score,Average Time\n';
    timeSeriesData.forEach((row: any) => {
      csv += `${row.date},${row.submissions},${row.completions},${row.averageScore},${row.averageTime}\n`;
    });

    csv += '\nField Analytics\n';
    csv += 'Field ID,Field Type,Response Count,Average Value,Most Common Value,Validation Errors\n';
    analytics.fieldAnalytics.forEach((field: any) => {
      csv += `${field.fieldId},${field.fieldType},${field.responseCount},${field.averageValue || 'N/A'},${field.mostCommonValue || 'N/A'},${field.validationErrors}\n`;
    });

    return csv;
  }
}