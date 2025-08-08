globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, b as renderTemplate, r as renderComponent, a3 as renderHead, a4 as addAttribute } from '../chunks/astro/server_BhDrV1PX.mjs';
/* empty css                                 */
import { N as NotebookLMInterface } from '../chunks/NotebookLMInterface_BEsirrAT.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$ChatPublic = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ChatPublic;
  const title = "AI Assistant Chat - Public";
  const description = "Chat with AI assistant and analyze documents";
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><title>", '</title><meta name="description"', ">", '</head> <body class="min-h-screen bg-gray-50"> <div class="h-screen flex flex-col"> <!-- Simple header --> <header class="bg-white border-b border-gray-200 px-4 py-3"> <div class="flex items-center justify-between"> <h1 class="text-xl font-semibold text-gray-900">IPLC AI Assistant (Public Test)</h1> <a href="/" class="text-sm text-blue-600 hover:text-blue-800">Back to Home</a> </div> </header> <!-- Chat interface takes up the rest of the screen --> <div class="flex-1 overflow-hidden"> ', ` </div> </div> <!-- Subtle noise texture overlay --> <div class="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=" 0 0 256 256" xmlns="http://www.w3.org/2000/svg" %3E%3Cfilter id="noiseFilter" %3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" %3E%3C filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" %3E%3C svg%3E');"></div> <script>
  const getThemePreference = () => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
 
  if (typeof localStorage !== 'undefined') {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
<\/script></body></html>`])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), renderHead(), renderComponent($$result, "NotebookLMInterface", NotebookLMInterface, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/chat/NotebookLMInterface", "client:component-export": "NotebookLMInterface" }));
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/chat-public.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/chat-public.astro";
const $$url = "/chat-public";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ChatPublic,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=chat-public.astro.mjs.map
