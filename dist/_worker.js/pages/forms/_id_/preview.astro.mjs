globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, a6 as defineScriptVars, a4 as addAttribute, m as maybeRenderHead } from '../../../chunks/astro/server_Cd9lk-7F.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_91kL-JTU.mjs';
import { B as Button } from '../../../chunks/button_B9vnY3WY.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../../../chunks/card_CmFEFEbr.mjs';
import { B as Badge } from '../../../chunks/badge_bicgCY70.mjs';
import { F as FormTemplateService } from '../../../chunks/form_template_whHHz9qG.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const $$Preview = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Preview;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/forms");
  }
  const { DB } = Astro2.locals.env || {};
  const formTemplateService = new FormTemplateService(DB);
  let template;
  try {
    template = await formTemplateService.getById(parseInt(id));
    if (!template) {
      return Astro2.redirect("/forms");
    }
  } catch (error) {
    console.error("Error loading form template:", error);
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Preview: ${template.name}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="space-y-8"> <!-- Header --> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold tracking-tight">Form Preview</h1> <p class="text-muted-foreground">\nPreviewing: <span class="font-medium">', '</span> </p> </div> <div class="flex gap-2"> ', " ", " ", " </div> </div> <!-- Form Information --> ", " <!-- Form Preview --> ", " <!-- Form Actions --> ", " </div> <script>(function(){", "\n    // Make template data available to React components\n    window.__FORM_TEMPLATE__ = template;\n    \n    // Handle form actions\n    document.addEventListener('DOMContentLoaded', () => {\n      // Add event handlers for publish/unpublish actions\n      const publishBtn = document.querySelector('[data-action=\"publish\"]');\n      const unpublishBtn = document.querySelector('[data-action=\"unpublish\"]');\n      \n      if (publishBtn) {\n        publishBtn.addEventListener('click', async () => {\n          try {\n            const response = await fetch(`/api/form-templates/${template.id}`, {\n              method: 'PUT',\n              headers: {\n                'Content-Type': 'application/json',\n              },\n              body: JSON.stringify({\n                ...template,\n                status: 'published'\n              })\n            });\n            \n            if (response.ok) {\n              window.location.reload();\n            }\n          } catch (error) {\n            console.error('Error publishing form:', error);\n          }\n        });\n      }\n      \n      if (unpublishBtn) {\n        unpublishBtn.addEventListener('click', async () => {\n          try {\n            const response = await fetch(`/api/form-templates/${template.id}`, {\n              method: 'PUT',\n              headers: {\n                'Content-Type': 'application/json',\n              },\n              body: JSON.stringify({\n                ...template,\n                status: 'draft'\n              })\n            });\n            \n            if (response.ok) {\n              window.location.reload();\n            }\n          } catch (error) {\n            console.error('Error unpublishing form:', error);\n          }\n        });\n      }\n    });\n  })();<\/script> "], [" ", '<div class="space-y-8"> <!-- Header --> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold tracking-tight">Form Preview</h1> <p class="text-muted-foreground">\nPreviewing: <span class="font-medium">', '</span> </p> </div> <div class="flex gap-2"> ', " ", " ", " </div> </div> <!-- Form Information --> ", " <!-- Form Preview --> ", " <!-- Form Actions --> ", " </div> <script>(function(){", "\n    // Make template data available to React components\n    window.__FORM_TEMPLATE__ = template;\n    \n    // Handle form actions\n    document.addEventListener('DOMContentLoaded', () => {\n      // Add event handlers for publish/unpublish actions\n      const publishBtn = document.querySelector('[data-action=\"publish\"]');\n      const unpublishBtn = document.querySelector('[data-action=\"unpublish\"]');\n      \n      if (publishBtn) {\n        publishBtn.addEventListener('click', async () => {\n          try {\n            const response = await fetch(\\`/api/form-templates/\\${template.id}\\`, {\n              method: 'PUT',\n              headers: {\n                'Content-Type': 'application/json',\n              },\n              body: JSON.stringify({\n                ...template,\n                status: 'published'\n              })\n            });\n            \n            if (response.ok) {\n              window.location.reload();\n            }\n          } catch (error) {\n            console.error('Error publishing form:', error);\n          }\n        });\n      }\n      \n      if (unpublishBtn) {\n        unpublishBtn.addEventListener('click', async () => {\n          try {\n            const response = await fetch(\\`/api/form-templates/\\${template.id}\\`, {\n              method: 'PUT',\n              headers: {\n                'Content-Type': 'application/json',\n              },\n              body: JSON.stringify({\n                ...template,\n                status: 'draft'\n              })\n            });\n            \n            if (response.ok) {\n              window.location.reload();\n            }\n          } catch (error) {\n            console.error('Error unpublishing form:', error);\n          }\n        });\n      }\n    });\n  })();<\/script> "])), maybeRenderHead(), template.name, renderComponent($$result2, "Button", Button, { "variant": "outline" }, { "default": async ($$result3) => renderTemplate` <a${addAttribute(`/forms/${id}/analytics`, "href")}>View Analytics</a> ` }), renderComponent($$result2, "Button", Button, {}, { "default": async ($$result3) => renderTemplate` <a${addAttribute(`/forms/${id}/edit`, "href")}>Edit Form</a> ` }), renderComponent($$result2, "Button", Button, { "variant": "outline" }, { "default": async ($$result3) => renderTemplate` <a href="/forms">← Back to Forms</a> ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` <div class="flex items-center justify-between"> <div> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`${template.name}` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`${template.description}` })} </div> <div class="flex items-center gap-2"> ${renderComponent($$result4, "Badge", Badge, { "variant": template.status === "published" ? "default" : "secondary" }, { "default": async ($$result5) => renderTemplate`${template.status}` })} ${renderComponent($$result4, "Badge", Badge, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`Version ${template.version}` })} </div> </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"> <div> <strong>Created:</strong> ${formatDate(template.created_at)} </div> <div> <strong>Last Updated:</strong> ${formatDate(template.updated_at)} </div> <div> <strong>Type:</strong> ${template.type} </div> </div> ` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Live Form` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Complete this form as a user would - data will be saved as a submission
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="bg-gray-50 p-6 rounded-lg"> ${renderComponent($$result4, "LiveFormRenderer", null, { "client:only": "react", "template": template, "client:component-hydration": "only", "client:component-path": "@/components/form-builder/LiveFormRenderer", "client:component-export": "LiveFormRenderer" })} </div> ` })} ` }), renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Form Actions` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Manage this form template
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div class="flex flex-wrap gap-4"> ${renderComponent($$result4, "Button", Button, {}, { "default": async ($$result5) => renderTemplate` <a${addAttribute(`/forms/${id}/edit`, "href")}>Edit Form</a> ` })} ${renderComponent($$result4, "Button", Button, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate` <a${addAttribute(`/forms/${id}/analytics`, "href")}>View Analytics</a> ` })} ${renderComponent($$result4, "Button", Button, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`
Share Form
` })} ${renderComponent($$result4, "Button", Button, { "variant": "outline" }, { "default": async ($$result5) => renderTemplate`
Export Data
` })} ${template.status === "draft" ? renderTemplate`${renderComponent($$result4, "Button", Button, {}, { "default": async ($$result5) => renderTemplate`
Publish Form
` })}` : renderTemplate`${renderComponent($$result4, "Button", Button, { "variant": "secondary" }, { "default": async ($$result5) => renderTemplate`
Unpublish Form
` })}`} </div> ` })} ` }), defineScriptVars({ template })) })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/[id]/preview.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/[id]/preview.astro";
const $$url = "/forms/[id]/preview";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Preview,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=preview.astro.mjs.map
