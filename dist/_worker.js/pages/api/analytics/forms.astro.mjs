globalThis.process ??= {}; globalThis.process.env ??= {};
import { F as FormAnalyticsService } from '../../../chunks/form_analytics_0O1GYlLm.mjs';
import { w as withPerformanceMonitoring } from '../../../chunks/performance-wrapper_COlTcJLx.mjs';
import { a as authenticate, b as authorize } from '../../../chunks/rbac-middleware_C5PL4AHx.mjs';
import { P as PERMISSIONS } from '../../../chunks/rbac_vK5lyOl9.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const getHandler = async (context) => {
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.READ, "forms");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const formAnalyticsService = new FormAnalyticsService(DB);
  const url = new URL(context.request.url);
  try {
    const templateId = url.searchParams.get("template_id");
    if (templateId) {
      const templateIdNum = parseInt(templateId, 10);
      const timeSeriesDays = url.searchParams.get("time_series");
      if (timeSeriesDays) {
        const days = parseInt(timeSeriesDays, 10);
        const timeSeriesData = await formAnalyticsService.getTimeSeriesAnalytics(templateIdNum, days);
        return Response.json({
          timeSeriesData,
          templateId: templateIdNum,
          days
        });
      }
      const exportFormat = url.searchParams.get("export");
      if (exportFormat) {
        const reportData = await formAnalyticsService.exportAnalyticsReport(templateIdNum, exportFormat);
        if (exportFormat === "csv") {
          return new Response(reportData, {
            headers: {
              "Content-Type": "text/csv",
              "Content-Disposition": `attachment; filename="form-analytics-${templateIdNum}.csv"`
            }
          });
        }
        return new Response(reportData, {
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="form-analytics-${templateIdNum}.json"`
          }
        });
      }
      const analytics = await formAnalyticsService.getFormAnalytics(templateIdNum);
      return Response.json({ analytics });
    }
    const submissionId = url.searchParams.get("submission_id");
    if (submissionId) {
      const submissionIdNum = parseInt(submissionId, 10);
      const submissionAnalytics = await formAnalyticsService.getSubmissionAnalytics(submissionIdNum);
      if (!submissionAnalytics) {
        return Response.json({ message: "Submission not found" }, { status: 404 });
      }
      return Response.json({ submissionAnalytics });
    }
    const compareParam = url.searchParams.get("compare");
    if (compareParam) {
      const templateIds = compareParam.split(",").map((id) => parseInt(id.trim(), 10)).filter((id) => !isNaN(id));
      if (templateIds.length === 0) {
        return Response.json({ message: "Invalid template IDs for comparison" }, { status: 400 });
      }
      const comparisonData = await formAnalyticsService.getFormComparisonAnalytics(templateIds);
      return Response.json({
        comparison: comparisonData,
        templateIds
      });
    }
    const clinicalInsights = url.searchParams.get("clinical_insights");
    if (clinicalInsights === "true") {
      const insights = await formAnalyticsService.getClinicalInsights();
      return Response.json({ clinicalInsights: insights });
    }
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
        success: false
      },
      { status: 500 }
    );
  }
};
const postHandler = async (context) => {
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.READ, "forms");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  try {
    const body = await context.request.json();
    const { operation, parameters } = body;
    const formAnalyticsService = new FormAnalyticsService(DB);
    switch (operation) {
      case "form_analytics":
        if (!parameters.template_id) {
          return Response.json({ message: "template_id is required" }, { status: 400 });
        }
        const analytics = await formAnalyticsService.getFormAnalytics(parameters.template_id);
        return Response.json({ analytics });
      case "submission_analytics":
        if (!parameters.submission_id) {
          return Response.json({ message: "submission_id is required" }, { status: 400 });
        }
        const submissionAnalytics = await formAnalyticsService.getSubmissionAnalytics(parameters.submission_id);
        if (!submissionAnalytics) {
          return Response.json({ message: "Submission not found" }, { status: 404 });
        }
        return Response.json({ submissionAnalytics });
      case "form_comparison":
        if (!parameters.template_ids || !Array.isArray(parameters.template_ids)) {
          return Response.json({ message: "template_ids array is required" }, { status: 400 });
        }
        const comparisonData = await formAnalyticsService.getFormComparisonAnalytics(parameters.template_ids);
        return Response.json({ comparison: comparisonData });
      case "time_series":
        if (!parameters.template_id) {
          return Response.json({ message: "template_id is required" }, { status: 400 });
        }
        const days = parameters.days || 30;
        const timeSeriesData = await formAnalyticsService.getTimeSeriesAnalytics(parameters.template_id, days);
        return Response.json({ timeSeriesData, days });
      case "clinical_insights":
        const insights = await formAnalyticsService.getClinicalInsights();
        return Response.json({ clinicalInsights: insights });
      case "export_report":
        if (!parameters.template_id) {
          return Response.json({ message: "template_id is required" }, { status: 400 });
        }
        const format = parameters.format || "json";
        const reportData = await formAnalyticsService.exportAnalyticsReport(parameters.template_id, format);
        if (format === "csv") {
          return new Response(reportData, {
            headers: {
              "Content-Type": "text/csv",
              "Content-Disposition": `attachment; filename="form-analytics-${parameters.template_id}.csv"`
            }
          });
        }
        return new Response(reportData, {
          headers: {
            "Content-Type": "application/json"
          }
        });
      default:
        return Response.json({
          message: "Invalid operation",
          supportedOperations: [
            "form_analytics",
            "submission_analytics",
            "form_comparison",
            "time_series",
            "clinical_insights",
            "export_report"
          ]
        }, { status: 400 });
    }
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to process analytics request",
        success: false
      },
      { status: 500 }
    );
  }
};
const GET = withPerformanceMonitoring(getHandler, "analytics-forms:get");
const POST = withPerformanceMonitoring(postHandler, "analytics-forms:process");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=forms.astro.mjs.map
