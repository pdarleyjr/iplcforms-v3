globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_CGOudIm3.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_C6d5n2BC.mjs';
import { C as CustomerService } from '../../../chunks/customer_CfmmZeU3.mjs';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from '../../../chunks/table_B4k96kdR.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { API_TOKEN, DB } = Astro2.locals.env || {};
  const { id } = Astro2.params;
  const customerService = new CustomerService(DB);
  const customer = await customerService.getById(id);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": customer.name }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div> ${renderComponent($$result2, "RunCustomerWorkflowButton", null, { "apiToken": API_TOKEN, "client:only": "react", "customerId": id, "client:component-hydration": "only", "client:component-path": "@/components/admin/run-customer-workflow", "client:component-export": "RunCustomerWorkflowButton" })} </div>`, "default": async ($$result2) => renderTemplate` <h2 class="text-xl font-bold tracking-tight">Customer Details</h2> ${renderComponent($$result2, "Table", Table, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "TableHeader", TableHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "TableRow", TableRow, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Name` })} ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Email` })} ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Notes` })} ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Created At` })} ${renderComponent($$result5, "TableHead", TableHead, {}, { "default": async ($$result6) => renderTemplate`Updated At` })} ` })} ` })} ${renderComponent($$result3, "TableBody", TableBody, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "TableRow", TableRow, {}, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${customer.name}` })} ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${customer.email}` })} ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${customer.notes}` })} ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${customer.created_at}` })} ${renderComponent($$result5, "TableCell", TableCell, {}, { "default": async ($$result6) => renderTemplate`${customer.updated_at}` })} ` })} ` })} ` })}  ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/customers/[id].astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/customers/[id].astro";
const $$url = "/admin/customers/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_id_.astro.mjs.map
