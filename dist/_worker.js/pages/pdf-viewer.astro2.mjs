globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as renderScript } from '../chunks/astro/server_BhDrV1PX.mjs';
import { $ as $$Layout } from '../chunks/Layout_Cm10FlEX.mjs';
import { $ as $$PDFAnnotator } from '../chunks/PDFAnnotator_C-Ph2J3h.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$PdfViewer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PdfViewer;
  const url = Astro2.url;
  const pdfUrl = url.searchParams.get("pdf") || "/sample.pdf";
  const readOnly = url.searchParams.get("readonly") === "true";
  const initialAnnotations = [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "PDF Annotator" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto py-8"> <div class="mb-6"> <h1 class="text-3xl font-bold mb-2">PDF Annotator</h1> <p class="text-gray-600">
View and annotate PDF documents. Select text to highlight, add comments, and export your annotations.
</p> <div class="mt-4 p-4 bg-blue-50 rounded-lg"> <p class="text-sm text-blue-800"> <strong>Tips:</strong> </p><ul class="list-disc list-inside mt-2"> <li>Select text to create a highlight</li> <li>Hold Alt and drag to create area highlights</li> <li>Click on highlights to view or edit comments</li> <li>Use the toolbar to change highlight colors</li> <li>Export annotations as JSON for backup</li> </ul>  </div> </div> ${renderComponent($$result2, "PDFAnnotator", $$PDFAnnotator, { "pdfUrl": pdfUrl, "initialAnnotations": initialAnnotations, "readOnly": readOnly, "showToolbar": true, "height": "calc(100vh - 300px)", "className": "shadow-lg rounded-lg" })} </div> ${renderScript($$result2, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/pdf-viewer.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/pdf-viewer.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/pdf-viewer.astro";
const $$url = "/pdf-viewer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PdfViewer,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=pdf-viewer.astro2.mjs.map
