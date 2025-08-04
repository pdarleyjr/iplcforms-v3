globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, a6 as defineScriptVars, a4 as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Cd9lk-7F.mjs';
import { $ as $$Layout } from '../../../../chunks/Layout_91kL-JTU.mjs';
import { B as Button } from '../../../../chunks/button_B9vnY3WY.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../../../../chunks/card_CmFEFEbr.mjs';
import { B as Badge } from '../../../../chunks/badge_bicgCY70.mjs';
import { F as FormTemplateService } from '../../../../chunks/form_template_whHHz9qG.mjs';
import { F as FormSubmissionService } from '../../../../chunks/form_submission_DFkhSEjI.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const $$submissionId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$submissionId;
  const { id, submissionId } = Astro2.params;
  if (!id || !submissionId) {
    return Astro2.redirect("/forms");
  }
  const { DB } = Astro2.locals.env || {};
  const formTemplateService = new FormTemplateService(DB);
  const formSubmissionService = new FormSubmissionService(DB);
  let template;
  let submission;
  try {
    template = await formTemplateService.getById(parseInt(id));
    if (!template) {
      return Astro2.redirect("/forms");
    }
    submission = await formSubmissionService.getById(parseInt(submissionId));
    if (!submission || submission.template_id !== parseInt(id)) {
      return Astro2.redirect(`/forms/${id}/analytics`);
    }
  } catch (error) {
    console.error("Error loading form submission:", error);
    return Astro2.redirect("/forms");
  }
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Submission #${submission.id} - ${template.name}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="space-y-8"> <!-- Header --> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold tracking-tight">Form Submission</h1> <p class="text-muted-foreground">\nViewing submission #', ' for: <span class="font-medium">', '</span> </p> </div> <div class="flex gap-2"> ', " ", " ", " </div> </div> <!-- Submission Information --> ", " <!-- Form Submission Content --> ", " <!-- Form Actions --> ", " </div> <script>(function(){", `
    // Make submission data available for PDF generation or other client-side operations
    window.__FORM_SUBMISSION__ = submission;
    window.__FORM_TEMPLATE__ = template;
    
    // Handle submission actions
    document.addEventListener('DOMContentLoaded', () => {
      // Add event handlers for various actions
      const exportPdfBtn = document.querySelector('[data-action="export-pdf"]');
      const printBtn = document.querySelector('[data-action="print"]');
      
      if (printBtn) {
        printBtn.addEventListener('click', () => {
          window.print();
        });
      }
      
      // Future: Add PDF export functionality
      if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', async () => {
          // PDF export logic would go here
          console.log('PDF export requested for submission:', submission.id);
        });
      }
    });
  })();<\/script> `])), maybeRenderHead(), submission.id, template.name, renderComponent($$result2, "Button", Button, { "variant": "outline" }, { "default": async ($$result3) => renderTemplate`
Export PDF
` }), renderComponent($$result2, "Button", Button, { "variant": "outline" }, { "default": async ($$result3) => renderTemplate`
Print
` }), renderComponent($$result2, "Button", Button, { "variant": "outline" }, { "default": async ($$result3) => renderTemplate` <a${addAttribute(`/forms/${id}/analytics`, "href")}>← Back to Analytics</a> ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` <div class="flex items-center justify-between"> <div> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Submission Details` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`Information about this form submission` })} </div> <div class="flex items-center gap-2"> ${renderComponent($$result4, "Badge", Badge, { "variant": submission.status === "completed" ? "default" : "secondary" }, { "default": async ($$result5) => renderTemplate`${submission.status}` })} ${submission.calculated_score && renderTemplate`${renderComponent($$result4, "Badge", Badge, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`Score: ${submission.calculated_score}` })}`} </div> </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"> <div> <strong>Submitted:</strong> ${formatDate(submission.submitted_at)} </div> <div> <strong>Submission ID:</strong> #${submission.id} </div> <div> <strong>Form Version:</strong> ${template.version} </div> </div> ${submission.submitted_by && renderTemplate`<div class="mt-4 text-sm"> <strong>Submitted by:</strong> ${submission.submitted_by.name} (${submission.submitted_by.email})
</div>`}` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Submitted Form` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Complete form submission as submitted by the user
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, { "class": "p-0" }, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "FormOutput", null, { "client:only": "react", "template": template, "submissionData": submission.form_data, "mode": "submission", "className": "border-0", "client:component-hydration": "only", "client:component-path": "@/components/form-builder/FormOutput", "client:component-export": "FormOutput" })} ` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Actions` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Available actions for this submission
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="flex flex-wrap gap-4"> ${renderComponent($$result4, "Button", Button, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`
Download PDF
` })} ${renderComponent($$result4, "Button", Button, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`
Email Copy
` })} ${renderComponent($$result4, "Button", Button, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`
Mark as Reviewed
` })} ${renderComponent($$result4, "Button", Button, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`
Add Note
` })} ${submission.status === "draft" && renderTemplate`${renderComponent($$result4, "Button", Button, {}, { "default": async ($$result5) => renderTemplate`
Mark as Complete
` })}`} </div> ` })} ` }), defineScriptVars({ submission, template })) })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/[id]/submissions/[submissionId].astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/[id]/submissions/[submissionId].astro";
const $$url = "/forms/[id]/submissions/[submissionId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$submissionId,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_submissionid_.astro.mjs.map
