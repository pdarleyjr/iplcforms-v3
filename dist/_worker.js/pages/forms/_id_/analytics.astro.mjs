globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, a7 as defineScriptVars, a4 as addAttribute, m as maybeRenderHead } from '../../../chunks/astro/server_CGOudIm3.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_C6d5n2BC.mjs';
import { B as Button } from '../../../chunks/button_CZXiuir8.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../../../chunks/card_Bkkbi2m7.mjs';
import { B as Badge } from '../../../chunks/badge_Cm5Qu_Jj.mjs';
import { F as FormTemplateService } from '../../../chunks/form_template_whHHz9qG.mjs';
import { F as FormAnalyticsService } from '../../../chunks/form_analytics_0O1GYlLm.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Analytics = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Analytics;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/forms");
  }
  const { DB } = Astro2.locals.env || {};
  const formTemplateService = new FormTemplateService(DB);
  const analyticsService = new FormAnalyticsService(DB);
  let template;
  let analytics;
  try {
    template = await formTemplateService.getById(parseInt(id));
    if (!template) {
      return Astro2.redirect("/forms");
    }
    analytics = await analyticsService.getFormAnalytics(parseInt(id));
  } catch (error) {
    console.error("Error loading form analytics:", error);
    return Astro2.redirect("/forms");
  }
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };
  const formatPercentage = (num) => {
    return `${(num * 100).toFixed(1)}%`;
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Analytics: ${template.name}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="space-y-8"> <!-- Header --> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold tracking-tight">Form Analytics</h1> <p class="text-muted-foreground">\nAnalytics for: <span class="font-medium">', '</span> </p> </div> <div class="flex gap-2"> ', " ", " ", " </div> </div> <!-- Form Info --> ", ' <!-- Key Metrics --> <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> ', " ", " ", " ", " </div> <!-- Submission Trends --> ", " <!-- Recent Submissions --> ", " <!-- Export Options --> ", " </div> <script>(function(){", "\n    // Make analytics data available for future chart implementations\n    window.__FORM_ANALYTICS__ = analytics;\n    window.__FORM_TEMPLATE__ = template;\n  })();<\/script> "])), maybeRenderHead(), template.name, renderComponent($$result2, "Button", Button, { "variant": "outline" }, { "default": async ($$result3) => renderTemplate` <a${addAttribute(`/forms/${id}/preview`, "href")}>Preview Form</a> ` }), renderComponent($$result2, "Button", Button, {}, { "default": async ($$result3) => renderTemplate` <a${addAttribute(`/forms/${id}/edit`, "href")}>Edit Form</a> ` }), renderComponent($$result2, "Button", Button, { "variant": "outline" }, { "default": async ($$result3) => renderTemplate` <a href="/forms">← Back to Forms</a> ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` <div class="flex items-center justify-between"> <div> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`${template.name}` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`${template.description}` })} </div> <div class="flex items-center gap-2"> ${renderComponent($$result4, "Badge", Badge, { "variant": template.status === "published" ? "default" : "secondary" }, { "default": async ($$result5) => renderTemplate`${template.status}` })} ${renderComponent($$result4, "Badge", Badge, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`Version ${template.version}` })} </div> </div> ` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "class": "flex flex-row items-center justify-between space-y-0 pb-2" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "class": "text-sm font-medium" }, { "default": async ($$result5) => renderTemplate`Total Submissions` })} <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="text-2xl font-bold">${formatNumber(analytics.totalSubmissions)}</div> <p class="text-xs text-muted-foreground">
+${analytics.submissionsThisMonth} this month
</p> ` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "class": "flex flex-row items-center justify-between space-y-0 pb-2" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "class": "text-sm font-medium" }, { "default": async ($$result5) => renderTemplate`Completion Rate` })} <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="text-2xl font-bold">${formatPercentage(analytics.completionRate)}</div> <p class="text-xs text-muted-foreground"> ${analytics.completedSubmissions} of ${analytics.startedSubmissions} started
</p> ` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "class": "flex flex-row items-center justify-between space-y-0 pb-2" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "class": "text-sm font-medium" }, { "default": async ($$result5) => renderTemplate`Avg. Time` })} <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="text-2xl font-bold">${Math.round(analytics.averageTimeToComplete / 60)}m</div> <p class="text-xs text-muted-foreground">
Average completion time
</p> ` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "class": "flex flex-row items-center justify-between space-y-0 pb-2" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, { "class": "text-sm font-medium" }, { "default": async ($$result5) => renderTemplate`Last Submission` })} <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="text-2xl font-bold"> ${analytics.lastSubmissionDate ? formatDate(analytics.lastSubmissionDate) : "None"} </div> <p class="text-xs text-muted-foreground">
Most recent submission
</p> ` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Submission Trends` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Form submission activity over the last 30 days
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="h-[200px] flex items-center justify-center text-muted-foreground"> <div class="text-center"> <svg class="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path> </svg> <p>Chart visualization would be implemented here</p> <p class="text-sm">Daily submission counts, completion rates, and trends</p> </div> </div> ` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Recent Submissions` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Latest form submissions and their status
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate`${analytics.recentSubmissions && analytics.recentSubmissions.length > 0 ? renderTemplate`<div class="space-y-4"> ${analytics.recentSubmissions.map((submission) => renderTemplate`<div class="flex items-center justify-between p-4 border rounded-lg"> <div class="flex items-center space-x-4"> <div class="w-2 h-2 bg-green-500 rounded-full"></div> <div> <p class="font-medium">Submission #${submission.id}</p> <p class="text-sm text-muted-foreground"> ${formatDate(submission.submitted_at)} </p> </div> </div> <div class="flex items-center space-x-2"> ${renderComponent($$result4, "Badge", Badge, { "variant": submission.status === "completed" ? "default" : "secondary" }, { "default": async ($$result5) => renderTemplate`${submission.status}` })} ${renderComponent($$result4, "Button", Button, { "variant": "outline", "size": "sm" }, { "default": async ($$result5) => renderTemplate` <a${addAttribute(`/forms/${id}/submissions/${submission.id}`, "href")}>View</a> ` })} </div> </div>`)} </div>` : renderTemplate`<div class="text-center py-8 text-muted-foreground"> <svg class="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> <p>No submissions yet</p> <p class="text-sm">Submissions will appear here once users start filling out your form</p> </div>`}` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Export Data` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Download form data and analytics reports
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="flex flex-wrap gap-4"> ${renderComponent($$result4, "Button", Button, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`
Export Submissions (CSV)
` })} ${renderComponent($$result4, "Button", Button, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`
Export Analytics Report (PDF)
` })} ${renderComponent($$result4, "Button", Button, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`
Export Summary (JSON)
` })} </div> ` })} ` }), defineScriptVars({ analytics, template })) })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/[id]/analytics.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/[id]/analytics.astro";
const $$url = "/forms/[id]/analytics";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Analytics,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=analytics.astro.mjs.map
