globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, a4 as addAttribute } from '../chunks/astro/server_Cd9lk-7F.mjs';
import { $ as $$Layout } from '../chunks/Layout_Cvn2ksVx.mjs';
import { B as Button } from '../chunks/button_B9vnY3WY.mjs';
import { C as Card } from '../chunks/card_CmFEFEbr.mjs';
import { F as FormTemplateService } from '../chunks/form_template_whHHz9qG.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { DB } = Astro2.locals.env || {};
  const formTemplateService = new FormTemplateService(DB);
  const templates = await formTemplateService.getAll();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Form Builder" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-8"> <div class="flex items-center justify-between"> <div> <h1 class="text-3xl font-bold tracking-tight">Form Builder</h1> <p class="text-muted-foreground">Create and manage your custom forms</p> </div> ${renderComponent($$result2, "Button", Button, {}, { "default": async ($$result3) => renderTemplate` <a href="/forms/new">Create New Form</a> ` })} </div> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> ${templates.map((template) => renderTemplate`${renderComponent($$result2, "Card", Card, { "className": "p-6" }, { "default": async ($$result3) => renderTemplate` <div class="space-y-4"> <div> <h3 class="text-lg font-semibold">${template.name}</h3> <p class="text-sm text-muted-foreground">${template.description}</p> </div> <div class="flex items-center justify-between text-sm text-muted-foreground"> <span>Version ${template.version}</span> <span${addAttribute(`px-2 py-1 rounded-full text-xs ${template.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`, "class")}> ${template.status} </span> </div> <div class="flex gap-2"> ${renderComponent($$result3, "Button", Button, { "variant": "outline", "size": "sm" }, { "default": async ($$result4) => renderTemplate` <a${addAttribute(`/forms/${template.id}/preview`, "href")}>Preview</a> ` })} ${renderComponent($$result3, "Button", Button, { "variant": "outline", "size": "sm" }, { "default": async ($$result4) => renderTemplate` <a${addAttribute(`/forms/${template.id}/edit`, "href")}>Edit</a> ` })} ${renderComponent($$result3, "Button", Button, { "variant": "outline", "size": "sm" }, { "default": async ($$result4) => renderTemplate` <a${addAttribute(`/forms/${template.id}/analytics`, "href")}>Analytics</a> ` })} </div> </div> ` })}`)} </div> ${templates.length === 0 && renderTemplate`<div class="text-center py-12"> <h3 class="text-lg font-semibold text-muted-foreground">No forms yet</h3> <p class="text-muted-foreground mt-2">Get started by creating your first form</p> ${renderComponent($$result2, "Button", Button, { "className": "mt-4" }, { "default": async ($$result3) => renderTemplate` <a href="/forms/new">Create Your First Form</a> ` })} </div>`} </div> ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/index.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/index.astro";
const $$url = "/forms";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=forms.astro.mjs.map
