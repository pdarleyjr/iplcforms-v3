globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, m as maybeRenderHead, a4 as addAttribute, d as renderScript, b as renderTemplate } from './astro/server_BhDrV1PX.mjs';
/* empty css                              */

const $$Astro = createAstro();
const $$PDFAnnotator = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PDFAnnotator;
  const {
    pdfUrl = "",
    initialAnnotations = [],
    readOnly = false,
    showToolbar = true,
    height = "800px",
    className = ""
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div id="pdf-annotator-root"${addAttribute(`pdf-annotator-container ${className}`, "class")}${addAttribute(pdfUrl, "data-pdf-url")}${addAttribute(JSON.stringify(initialAnnotations), "data-initial-annotations")}${addAttribute(readOnly, "data-read-only")}${addAttribute(showToolbar, "data-show-toolbar")}${addAttribute(height, "data-height")} data-astro-cid-mt3bnnoh> <div class="flex items-center justify-center h-full" data-astro-cid-mt3bnnoh> <div class="text-gray-500" data-astro-cid-mt3bnnoh>Loading PDF Annotator...</div> </div> </div> ${renderScript($$result, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/components/pdf/PDFAnnotator.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/components/pdf/PDFAnnotator.astro", void 0);

export { $$PDFAnnotator as $ };
//# sourceMappingURL=PDFAnnotator_C-Ph2J3h.mjs.map
