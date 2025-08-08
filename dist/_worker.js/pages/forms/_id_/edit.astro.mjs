globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, a6 as defineScriptVars, a4 as addAttribute, m as maybeRenderHead } from '../../../chunks/astro/server_Cd9lk-7F.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_Cvn2ksVx.mjs';
import { B as Button } from '../../../chunks/button_B9vnY3WY.mjs';
import { F as FormTemplateService } from '../../../chunks/form_template_whHHz9qG.mjs';
/* empty css                                      */
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const prerender = false;
const $$Edit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Edit;
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Edit Form: ${template.name}`, "data-astro-cid-5vshvx7i": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="space-y-8" data-astro-cid-5vshvx7i> <div class="flex items-center justify-between" data-astro-cid-5vshvx7i> <div data-astro-cid-5vshvx7i> <h1 class="text-3xl font-bold tracking-tight" data-astro-cid-5vshvx7i>Edit Form</h1> <p class="text-muted-foreground" data-astro-cid-5vshvx7i>\nEditing: <span class="font-medium" data-astro-cid-5vshvx7i>', "</span> (Version ", ')\n</p> </div> <div class="flex gap-2" data-astro-cid-5vshvx7i> ', " ", ' </div> </div> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6" data-astro-cid-5vshvx7i> <!-- Component Palette --> <div class="lg:col-span-1" data-astro-cid-5vshvx7i> <div class="sticky top-6" data-astro-cid-5vshvx7i> <h3 class="text-lg font-semibold mb-4" data-astro-cid-5vshvx7i>Components</h3> ', ' </div> </div> <!-- Form Builder --> <div class="lg:col-span-3" data-astro-cid-5vshvx7i> <div class="border rounded-lg" data-astro-cid-5vshvx7i> ', " </div> </div> </div> </div>  <script>(function(){", "\n    // Make template data available to React components\n    window.__FORM_TEMPLATE__ = template;\n  })();<\/script> "])), maybeRenderHead(), template.name, template.version, renderComponent($$result2, "Button", Button, { "variant": "outline", "data-astro-cid-5vshvx7i": true }, { "default": async ($$result3) => renderTemplate` <a${addAttribute(`/forms/${id}/preview`, "href")} data-astro-cid-5vshvx7i>Preview</a> ` }), renderComponent($$result2, "Button", Button, { "variant": "outline", "data-astro-cid-5vshvx7i": true }, { "default": async ($$result3) => renderTemplate` <a href="/forms" data-astro-cid-5vshvx7i>← Back to Forms</a> ` }), renderComponent($$result2, "ComponentPalette", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-5vshvx7i": true, "client:component-path": "@/components/form-builder/ComponentPalette", "client:component-export": "ComponentPalette" }), renderComponent($$result2, "FormBuilder", null, { "client:only": "react", "mode": "edit", "templateId": template.id, "initialTemplate": template, "onSave": (updatedTemplate) => {
    window.location.href = `/forms/${template.id}/preview`;
  }, "onCancel": () => {
    window.location.href = "/forms";
  }, "client:component-hydration": "only", "data-astro-cid-5vshvx7i": true, "client:component-path": "@/components/form-builder/FormBuilder", "client:component-export": "FormBuilder" }), defineScriptVars({ template })) })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/[id]/edit.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/[id]/edit.astro";
const $$url = "/forms/[id]/edit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Edit,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=edit.astro.mjs.map
