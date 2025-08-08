globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, d as renderScript, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BhDrV1PX.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Cm10FlEX.mjs';
import { $ as $$PDFAnnotator } from '../../chunks/PDFAnnotator_C-Ph2J3h.mjs';
/* empty css                                   */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const pdfUrl = "/sample.pdf";
  const pdfTitle = `PDF Document ${id}`;
  let initialAnnotations = [];
  try {
    const response = await fetch(`${Astro2.url.origin}/api/pdf-annotations/${id}`);
    if (response.ok) {
      const data = await response.json();
      initialAnnotations = data.annotations || [];
    }
  } catch (error) {
    console.error("Failed to fetch initial annotations:", error);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pdfTitle, "data-astro-cid-sjjxaxgq": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto py-8" data-astro-cid-sjjxaxgq> <div class="mb-6" data-astro-cid-sjjxaxgq> <h1 class="text-3xl font-bold text-gray-900" data-astro-cid-sjjxaxgq>${pdfTitle}</h1> <p class="text-gray-600 mt-2" data-astro-cid-sjjxaxgq>Document ID: ${id}</p> </div> <div class="pdf-viewer-container" data-astro-cid-sjjxaxgq> ${renderComponent($$result2, "PDFAnnotator", $$PDFAnnotator, { "pdfUrl": pdfUrl, "pdfId": id, "initialAnnotations": initialAnnotations, "data-astro-cid-sjjxaxgq": true })} </div> </div> ` })}  ${renderScript($$result, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/pdf-viewer/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/pdf-viewer/[id].astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/pdf-viewer/[id].astro";
const $$url = "/pdf-viewer/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_id_.astro.mjs.map
