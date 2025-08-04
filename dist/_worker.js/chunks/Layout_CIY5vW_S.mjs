globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, b as renderTemplate, a2 as renderSlot, r as renderComponent, a3 as renderHead, a4 as addAttribute } from './astro/server_Cd9lk-7F.mjs';
/* empty css                         */
import { A as ApiTokenMissingCard, H as Header } from './api-token-missing-card_DpVAtDRF.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const currentPath = Astro2.url.pathname;
  const title = Astro2.props.title || "SaaS Admin Template";
  const env = Astro2.locals.env || {};
  const API_TOKEN = env.API_TOKEN || process.env.API_TOKEN || "dev_fallback_token";
  const apiTokenSet = API_TOKEN !== "" && API_TOKEN !== "dev_fallback_token";
  return renderTemplate(_a || (_a = __template([`<script>
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
</script> <html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"`, "><title>", "</title>", "</head> <body> ", ' <div class="flex-1 space-y-4 p-8 pt-6"> <div class="mb-4"> ', ' </div> <div class="flex items-center justify-between"> ', " </div> ", " </div> </body></html>"])), addAttribute(Astro2.generator, "content"), `${title} - SaaS Admin Template` , renderHead(), renderComponent($$result, "Header", Header, { "currentPath": currentPath }), !apiTokenSet && renderTemplate`${renderComponent($$result, "ApiTokenMissingCard", ApiTokenMissingCard, {})}`, renderSlot($$result, $$slots["actions"]), renderSlot($$result, $$slots["default"]));
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
//# sourceMappingURL=Layout_CIY5vW_S.mjs.map
