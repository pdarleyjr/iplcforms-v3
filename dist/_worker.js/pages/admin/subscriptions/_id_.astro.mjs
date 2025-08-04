globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_Cd9lk-7F.mjs';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from '../../../chunks/table_CjuqCPRW.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_CIY5vW_S.mjs';
import { S as SubscriptionService } from '../../../chunks/subscription_Dua9-wUJ.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { API_TOKEN, DB } = Astro2.locals.env || {};
  const { id } = Astro2.params;
  const subscriptionService = new SubscriptionService(DB);
  const subscription = await subscriptionService.getById(id);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": subscription.name }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div></div>`, "default": async ($$result2) => renderTemplate` <div class="flex flex-col gap-8"> <div> <h2 class="text-xl font-bold tracking-tight">Subscription Details</h2> ${renderComponent($$result2, "Table", Table, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "TableHeader", TableHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "TableRow", TableRow, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Name` })} ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Description` })} ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Price` })} ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Created At` })} ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Updated At` })} ` })} ` })} ${renderComponent($$result3, "TableBody", TableBody, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "TableRow", TableRow, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${subscription.name}` })} ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${subscription.description}` })} ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${subscription.price}` })} ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${subscription.created_at}` })} ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${subscription.updated_at}` })} ` })} ` })} ` })} </div> <div> <h2 class="text-xl font-bold tracking-tight">Features</h2> ${!subscription.features || subscription.features.length === 0 ? renderTemplate`<p class="font-medium text-muted-foreground">
No features added for this subscription.
</p>` : renderTemplate`${renderComponent($$result2, "Table", Table, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "TableHeader", TableHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "TableRow", TableRow, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Name` })} ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Description` })} ` })} ` })} ${renderComponent($$result3, "TableBody", TableBody, {}, { "default": async ($$result4) => renderTemplate`${subscription?.features?.map((feature, index) => renderTemplate`${renderComponent($$result4, "TableRow", TableRow, { "key": index }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${feature.name}` })} ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${feature.description}` })} ` })}`)}` })} ` })}`} </div> </div>  ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/subscriptions/[id].astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/subscriptions/[id].astro";
const $$url = "/admin/subscriptions/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_id_.astro.mjs.map
