globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CGOudIm3.mjs';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_ROplkpJq.mjs';
import { N as NotebookLMInterface } from '../chunks/NotebookLMInterface_CHx-g_Pk.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const $$Chat = createComponent(($$result, $$props, $$slots) => {
  const title = "AI Assistant Chat";
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="h-full"> ${renderComponent($$result2, "NotebookLMInterface", NotebookLMInterface, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/chat/NotebookLMInterface", "client:component-export": "NotebookLMInterface" })} </div> ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/chat.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/chat.astro";
const $$url = "/chat";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Chat,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=chat.astro.mjs.map
