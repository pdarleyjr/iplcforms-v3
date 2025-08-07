globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BhDrV1PX.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Cm10FlEX.mjs';
import { B as Button } from '../../chunks/button_D4hUjemp.mjs';
/* empty css                                  */
export { renderers } from '../../renderers.mjs';

const $$New = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Create New Form", "data-astro-cid-u3qoswlz": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-8" data-astro-cid-u3qoswlz> <div class="flex items-center justify-between" data-astro-cid-u3qoswlz> <div data-astro-cid-u3qoswlz> <h1 class="text-3xl font-bold tracking-tight" data-astro-cid-u3qoswlz>Create New Form</h1> <p class="text-muted-foreground" data-astro-cid-u3qoswlz>Design your custom form with drag-and-drop components</p> </div> ${renderComponent($$result2, "Button", Button, { "variant": "outline", "data-astro-cid-u3qoswlz": true }, { "default": ($$result3) => renderTemplate` <a href="/forms" data-astro-cid-u3qoswlz>← Back to Forms</a> ` })} </div> <!-- Form Builder now contains the ComponentPalette internally --> <div class="w-full" data-astro-cid-u3qoswlz> ${renderComponent($$result2, "FormBuilder", null, { "client:only": "react", "mode": "create", "data-testid": "form-builder", "onSave": (template) => {
    window.location.href = "/forms";
  }, "onCancel": () => {
    window.location.href = "/forms";
  }, "client:component-hydration": "only", "data-astro-cid-u3qoswlz": true, "client:component-path": "@/components/form-builder/FormBuilder", "client:component-export": "FormBuilder" })} </div> </div>  ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/new.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/forms/new.astro";
const $$url = "/forms/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=new.astro.mjs.map
