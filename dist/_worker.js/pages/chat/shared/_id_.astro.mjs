globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as renderScript } from '../../../chunks/astro/server_CGOudIm3.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_C6d5n2BC.mjs';
import { C as Card } from '../../../chunks/card_Bkkbi2m7.mjs';
import { S as Share2, U as User, B as Bot } from '../../../chunks/user_D0fDNzx7.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Shared Chat Snippet - IPLC Forms" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4"> <div class="max-w-4xl mx-auto"> <!-- Header --> <div class="mb-8 text-center"> <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gradient-metal-start to-gradient-metal-end mb-4"> ${renderComponent($$result2, "Share2", Share2, { "class": "w-8 h-8 text-white" })} </div> <h1 class="text-3xl font-bold mb-2">Shared Chat Snippet</h1> <p class="text-muted-foreground">This conversation was shared from IPLC Forms AI Assistant</p> </div> <!-- Loading State --> <div id="loading" class="text-center py-12"> <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div> <p class="text-muted-foreground mt-4">Loading conversation...</p> </div> <!-- Error State --> <div id="error" class="hidden"> ${renderComponent($$result2, "Card", Card, { "class": "p-8 text-center" }, { "default": async ($$result3) => renderTemplate` <div class="text-destructive mb-4"> <svg class="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path> </svg> </div> <h2 class="text-xl font-semibold mb-2">Snippet Not Found</h2> <p class="text-muted-foreground">This snippet may have expired or the link may be invalid.</p> ` })} </div> <!-- Content --> <div id="content" class="hidden space-y-6"> <!-- Question --> ${renderComponent($$result2, "Card", Card, { "class": "p-6" }, { "default": async ($$result3) => renderTemplate` <div class="flex gap-4"> <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0"> ${renderComponent($$result3, "User", User, { "class": "w-5 h-5" })} </div> <div class="flex-1"> <p class="font-medium text-sm text-muted-foreground mb-1">Question</p> <p id="question" class="text-base"></p> </div> </div> ` })} <!-- Answer --> ${renderComponent($$result2, "Card", Card, { "class": "p-6" }, { "default": async ($$result3) => renderTemplate` <div class="flex gap-4"> <div class="w-8 h-8 rounded-full bg-gradient-to-r from-gradient-metal-start to-gradient-metal-end flex items-center justify-center flex-shrink-0"> ${renderComponent($$result3, "Bot", Bot, { "class": "w-5 h-5 text-white" })} </div> <div class="flex-1"> <p class="font-medium text-sm text-muted-foreground mb-1">AI Assistant</p> <div id="answer" class="text-base prose prose-sm max-w-none"></div> <!-- Citations --> <div id="citations" class="mt-4 space-y-2 hidden"> <p class="font-medium text-sm text-muted-foreground">Sources:</p> <div id="citations-list" class="space-y-2"></div> </div> </div> </div> ` })} <!-- Metadata --> <div class="text-center text-sm text-muted-foreground"> <p>Shared on <span id="created-date"></span></p> <p>Expires on <span id="expires-date"></span></p> </div> </div> </div> </div> ${renderScript($$result2, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/chat/shared/[id].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/chat/shared/[id].astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/chat/shared/[id].astro";
const $$url = "/chat/shared/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_id_.astro.mjs.map
