globalThis.process ??= {}; globalThis.process.env ??= {};
import { F as FormTemplateService } from '../../../chunks/form_template_whHHz9qG.mjs';
import { F as FormSubmissionService } from '../../../chunks/form_submission_DFkhSEjI.mjs';
import { g as getD1Manager } from '../../../chunks/d1-connection-manager_oVL7uFVJ.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const GET = async ({ locals }) => {
  try {
    const runtime = locals.runtime;
    const env = runtime?.env;
    if (!env?.DB) {
      return new Response(JSON.stringify({
        error: "Database not available",
        details: "D1 database binding not found in runtime environment"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const connectionManager = getD1Manager(env.DB);
    const templateService = new FormTemplateService(env.DB);
    const submissionService = new FormSubmissionService(env.DB);
    const stats = await connectionManager.executeWithCache(
      "landing_page_dashboard_stats",
      async () => {
        const activeTemplates = await templateService.getAll({ status: true });
        const activePatients = activeTemplates.length;
        const allTemplates = await templateService.getAll({});
        const formsCreated = allTemplates.length;
        const submissionStats = await submissionService.getSubmissionStats();
        const totalSubmissions = submissionStats.total || 0;
        const completedSubmissions = submissionStats.byStatus?.submitted || 0;
        const reviewedSubmissions = submissionStats.byStatus?.reviewed || 0;
        const completedCount = completedSubmissions + reviewedSubmissions;
        let completionRate = "0.0";
        if (totalSubmissions > 0) {
          const rate = completedCount / totalSubmissions * 100;
          completionRate = rate.toFixed(1);
        }
        return {
          activePatients,
          formsCreated,
          completionRate: completionRate + "%"
        };
      },
      5 * 60 * 1e3
      // 5 minutes cache TTL as recommended by research
    );
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        "X-Powered-By": "Cloudflare D1"
        // CORS headers are now handled by middleware
      }
    });
  } catch (error) {
    console.error("Dashboard overview API error:", error);
    const errorResponse = {
      error: "Internal server error",
      message: "Failed to retrieve dashboard statistics",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...false
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=overview.astro.mjs.map
