import { FormAnalyticsService } from "@/lib/services/form_analytics";
import { validateApiTokenResponse } from "@/lib/api";

export async function GET({ locals, request }: any) {
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const formAnalyticsService = new FormAnalyticsService(DB);
  const url = new URL(request.url);

  try {
    // Template-specific analytics
    const templateId = url.searchParams.get('template_id');
    if (templateId) {
      const templateIdNum = parseInt(templateId, 10);
      
      // Time series analytics
      const timeSeriesDays = url.searchParams.get('time_series');
      if (timeSeriesDays) {
        const days = parseInt(timeSeriesDays, 10);
        const timeSeriesData = await formAnalyticsService.getTimeSeriesAnalytics(templateIdNum, days);
        return Response.json({ 
          timeSeriesData,
          templateId: templateIdNum,
          days 
        });
      }

      // Export analytics report
      const exportFormat = url.searchParams.get('export') as 'json' | 'csv' | null;
      if (exportFormat) {
        const reportData = await formAnalyticsService.exportAnalyticsReport(templateIdNum, exportFormat);
        
        if (exportFormat === 'csv') {
          return new Response(reportData, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': `attachment; filename="form-analytics-${templateIdNum}.csv"`
            }
          });
        }
        
        return new Response(reportData, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="form-analytics-${templateIdNum}.json"`
          }
        });
      }

      // Basic form analytics
      const analytics = await formAnalyticsService.getFormAnalytics(templateIdNum);
      return Response.json({ analytics });
    }

    // Submission-specific analytics
    const submissionId = url.searchParams.get('submission_id');
    if (submissionId) {
      const submissionIdNum = parseInt(submissionId, 10);
      const submissionAnalytics = await formAnalyticsService.getSubmissionAnalytics(submissionIdNum);
      
      if (!submissionAnalytics) {
        return Response.json({ message: "Submission not found" }, { status: 404 });
      }
      
      return Response.json({ submissionAnalytics });
    }

    // Form comparison analytics
    const compareParam = url.searchParams.get('compare');
    if (compareParam) {
      const templateIds = compareParam.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
      
      if (templateIds.length === 0) {
        return Response.json({ message: "Invalid template IDs for comparison" }, { status: 400 });
      }
      
      const comparisonData = await formAnalyticsService.getFormComparisonAnalytics(templateIds);
      return Response.json({ 
        comparison: comparisonData,
        templateIds 
      });
    }

    // Clinical insights
    const clinicalInsights = url.searchParams.get('clinical_insights');
    if (clinicalInsights === 'true') {
      const insights = await formAnalyticsService.getClinicalInsights();
      return Response.json({ clinicalInsights: insights });
    }

    // No specific analytics requested - return available endpoints
    return Response.json({
      message: "Form Analytics API",
      availableEndpoints: {
        formAnalytics: "?template_id={id}",
        submissionAnalytics: "?submission_id={id}",
        timeSeriesAnalytics: "?template_id={id}&time_series={days}",
        formComparison: "?compare={id1,id2,id3}",
        clinicalInsights: "?clinical_insights=true",
        exportReport: "?template_id={id}&export={json|csv}"
      },
      examples: [
        "/api/analytics/forms?template_id=1",
        "/api/analytics/forms?submission_id=123",
        "/api/analytics/forms?template_id=1&time_series=30",
        "/api/analytics/forms?compare=1,2,3",
        "/api/analytics/forms?clinical_insights=true",
        "/api/analytics/forms?template_id=1&export=csv"
      ]
    });

  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to retrieve analytics data",
        success: false,
      },
      { status: 500 },
    );
  }
}

export async function POST({ locals, request }: any) {
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  try {
    const body = await request.json();
    const { operation, parameters } = body;

    const formAnalyticsService = new FormAnalyticsService(DB);

    switch (operation) {
      case 'form_analytics':
        if (!parameters.template_id) {
          return Response.json({ message: "template_id is required" }, { status: 400 });
        }
        const analytics = await formAnalyticsService.getFormAnalytics(parameters.template_id);
        return Response.json({ analytics });

      case 'submission_analytics':
        if (!parameters.submission_id) {
          return Response.json({ message: "submission_id is required" }, { status: 400 });
        }
        const submissionAnalytics = await formAnalyticsService.getSubmissionAnalytics(parameters.submission_id);
        if (!submissionAnalytics) {
          return Response.json({ message: "Submission not found" }, { status: 404 });
        }
        return Response.json({ submissionAnalytics });

      case 'form_comparison':
        if (!parameters.template_ids || !Array.isArray(parameters.template_ids)) {
          return Response.json({ message: "template_ids array is required" }, { status: 400 });
        }
        const comparisonData = await formAnalyticsService.getFormComparisonAnalytics(parameters.template_ids);
        return Response.json({ comparison: comparisonData });

      case 'time_series':
        if (!parameters.template_id) {
          return Response.json({ message: "template_id is required" }, { status: 400 });
        }
        const days = parameters.days || 30;
        const timeSeriesData = await formAnalyticsService.getTimeSeriesAnalytics(parameters.template_id, days);
        return Response.json({ timeSeriesData, days });

      case 'clinical_insights':
        const insights = await formAnalyticsService.getClinicalInsights();
        return Response.json({ clinicalInsights: insights });

      case 'export_report':
        if (!parameters.template_id) {
          return Response.json({ message: "template_id is required" }, { status: 400 });
        }
        const format = parameters.format || 'json';
        const reportData = await formAnalyticsService.exportAnalyticsReport(parameters.template_id, format);
        
        if (format === 'csv') {
          return new Response(reportData, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': `attachment; filename="form-analytics-${parameters.template_id}.csv"`
            }
          });
        }
        
        return new Response(reportData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

      default:
        return Response.json({ 
          message: "Invalid operation",
          supportedOperations: [
            'form_analytics',
            'submission_analytics', 
            'form_comparison',
            'time_series',
            'clinical_insights',
            'export_report'
          ]
        }, { status: 400 });
    }

  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to process analytics request",
        success: false,
      },
      { status: 500 },
    );
  }
}