globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, a4 as addAttribute } from '../chunks/astro/server_BhDrV1PX.mjs';
import { $ as $$Layout } from '../chunks/Layout_Cm10FlEX.mjs';
import { C as Card } from '../chunks/card_DRaKdq96.mjs';
import { B as Button } from '../chunks/button_D4hUjemp.mjs';
/* empty css                                 */
import { W as FileText, aJ as ExternalLink, aD as Plus } from '../chunks/react-vendor_BBaf1uT2.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const samplePDFs = [
    { id: "1", name: "Sample Document 1", description: "Clinical evaluation form" },
    { id: "2", name: "Sample Document 2", description: "Patient assessment report" },
    { id: "3", name: "Sample Document 3", description: "Treatment plan documentation" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "PDF Viewer", "data-astro-cid-zekgjnyt": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto py-8" data-astro-cid-zekgjnyt> <div class="mb-8" data-astro-cid-zekgjnyt> <h1 class="text-3xl font-bold text-gray-900" data-astro-cid-zekgjnyt>PDF Document Viewer</h1> <p class="text-gray-600 mt-2" data-astro-cid-zekgjnyt>View and annotate PDF documents</p> </div> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-astro-cid-zekgjnyt> ${samplePDFs.map((pdf) => renderTemplate`${renderComponent($$result2, "Card", Card, { "className": "p-6 hover:shadow-lg transition-shadow", "data-astro-cid-zekgjnyt": true }, { "default": ($$result3) => renderTemplate` <div class="flex items-start justify-between mb-4" data-astro-cid-zekgjnyt> ${renderComponent($$result3, "FileText", FileText, { "className": "w-8 h-8 text-blue-500", "data-astro-cid-zekgjnyt": true })} <a${addAttribute(`/pdf-viewer/${pdf.id}`, "href")} class="text-blue-600 hover:text-blue-800" data-astro-cid-zekgjnyt> ${renderComponent($$result3, "ExternalLink", ExternalLink, { "className": "w-5 h-5", "data-astro-cid-zekgjnyt": true })} </a> </div> <h3 class="text-lg font-semibold mb-2" data-astro-cid-zekgjnyt>${pdf.name}</h3> <p class="text-gray-600 text-sm mb-4" data-astro-cid-zekgjnyt>${pdf.description}</p> <a${addAttribute(`/pdf-viewer/${pdf.id}`, "href")} data-astro-cid-zekgjnyt> ${renderComponent($$result3, "Button", Button, { "variant": "outline", "size": "sm", "className": "w-full", "data-astro-cid-zekgjnyt": true }, { "default": ($$result4) => renderTemplate`
View Document
` })} </a> ` })}`)} <!-- Add new PDF card --> ${renderComponent($$result2, "Card", Card, { "className": "p-6 border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors", "data-astro-cid-zekgjnyt": true }, { "default": ($$result3) => renderTemplate` <div class="flex flex-col items-center justify-center h-full text-gray-500" data-astro-cid-zekgjnyt> ${renderComponent($$result3, "Plus", Plus, { "className": "w-12 h-12 mb-3", "data-astro-cid-zekgjnyt": true })} <p class="text-sm font-medium" data-astro-cid-zekgjnyt>Upload New PDF</p> <p class="text-xs mt-1" data-astro-cid-zekgjnyt>Coming soon</p> </div> ` })} </div> <div class="mt-12" data-astro-cid-zekgjnyt> ${renderComponent($$result2, "Card", Card, { "className": "p-6", "data-astro-cid-zekgjnyt": true }, { "default": ($$result3) => renderTemplate` <h2 class="text-xl font-semibold mb-4" data-astro-cid-zekgjnyt>About PDF Annotations</h2> <div class="space-y-3 text-gray-600" data-astro-cid-zekgjnyt> <p data-astro-cid-zekgjnyt>
This PDF viewer allows you to:
</p> <ul class="list-disc list-inside space-y-2 ml-4" data-astro-cid-zekgjnyt> <li data-astro-cid-zekgjnyt>View PDF documents directly in your browser</li> <li data-astro-cid-zekgjnyt>Add highlights and annotations to important sections</li> <li data-astro-cid-zekgjnyt>Save annotations for future reference</li> <li data-astro-cid-zekgjnyt>Export and import annotation data</li> <li data-astro-cid-zekgjnyt>Collaborate with team members on document review</li> </ul> <p class="mt-4" data-astro-cid-zekgjnyt> <strong data-astro-cid-zekgjnyt>How to use:</strong> Click on any document above to open it in the viewer. 
            Select text to add highlights, and use Alt+Click to create area selections.
</p> </div> ` })} </div> </div> ` })} `;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/pdf-viewer/index.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/pdf-viewer/index.astro";
const $$url = "/pdf-viewer";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=pdf-viewer.astro.mjs.map
