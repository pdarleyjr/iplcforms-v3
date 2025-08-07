globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Cd9lk-7F.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Cvn2ksVx.mjs';
import { C as CustomerService } from '../../chunks/customer_CfmmZeU3.mjs';
import { j as jsxRuntimeExports } from '../../chunks/card_CmFEFEbr.mjs';
import { c as createColumnHelper, u as useReactTable, D as DataTable, g as getCoreRowModel } from '../../chunks/data-table_VJHBuh5A.mjs';
import { B as Badge } from '../../chunks/badge_bicgCY70.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const columnHelper = createColumnHelper();
const getProfessionalType = (notes) => {
  if (!notes) return null;
  if (notes.toLowerCase().includes("slp")) return "SLP";
  if (notes.toLowerCase().includes("ot")) return "OT";
  if (notes.toLowerCase().includes("pt")) return "PT";
  return null;
};
const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "default";
    case "inactive":
      return "secondary";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
};
const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-sm text-slate-600", children: [
      "#",
      String(info.getValue()).padStart(4, "0")
    ] })
  }),
  columnHelper.accessor("name", {
    header: "Healthcare Professional",
    cell: (info) => {
      const professionalType = getProfessionalType(info.row.original.notes);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            className: "font-medium text-slate-900 hover:text-blue-600 transition-colors flex items-center space-x-2",
            href: `/admin/customers/${info.row.original.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold", children: info.getValue().split(" ").map((n) => n[0]).join("") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: info.getValue() })
            ]
          }
        ),
        professionalType && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "secondary",
            className: `text-xs ${professionalType === "SLP" ? "bg-blue-100 text-blue-800" : professionalType === "OT" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}`,
            children: professionalType === "SLP" ? "🗣️ Speech-Language Pathologist" : professionalType === "OT" ? "🖐️ Occupational Therapist" : "🏃 Physical Therapist"
          }
        )
      ] });
    }
  }),
  columnHelper.accessor("email", {
    header: "Contact Information",
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-900", children: info.getValue() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center text-xs text-slate-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }),
        "Verified Contact"
      ] })
    ] })
  }),
  columnHelper.accessor("notes", {
    header: "Clinical Notes",
    cell: (info) => {
      const notes = info.getValue();
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-xs", children: notes ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-600 truncate", title: notes, children: notes }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 italic", children: "No clinical notes" }) });
    }
  }),
  {
    id: "subscription_status",
    header: "License Status",
    cell: (info) => {
      const status = info.row.original.subscription?.status || "inactive";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: getStatusVariant(status), className: "capitalize", children: [
        status === "active" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full mr-1" }),
        status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full mr-1" }),
        status === "inactive" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full mr-1" }),
        status
      ] });
    }
  },
  columnHelper.accessor("created_at", {
    header: "Registration Date",
    cell: (info) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-900", children: new Date(info.getValue()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500", children: new Date(info.getValue()).toLocaleDateString("en-US", {
        weekday: "short"
      }) })
    ] })
  }),
  columnHelper.accessor("updated_at", {
    header: "Last Activity",
    cell: (info) => {
      const daysSince = Math.floor(((/* @__PURE__ */ new Date()).getTime() - new Date(info.getValue()).getTime()) / (1e3 * 60 * 60 * 24));
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-900", children: daysSince === 0 ? "Today" : daysSince === 1 ? "Yesterday" : `${daysSince} days ago` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500", children: new Date(info.getValue()).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }) })
      ] });
    }
  })
];
function CustomersTable({ data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-slate-900 flex items-center space-x-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Healthcare Professionals Directory" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 mt-1", children: "Manage licensed speech-language pathologists and occupational therapists" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { table })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Customers = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Customers;
  const { API_TOKEN, DB } = Astro2.locals.env || {};
  const customerService = new CustomerService(DB);
  const customers = await customerService.getAll();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Customers" }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div> ${renderComponent($$result2, "CreateCustomerButton", null, { "apiToken": API_TOKEN, "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/admin/create-customer", "client:component-export": "CreateCustomerButton" })} </div>`, "default": async ($$result2) => renderTemplate`${customers.length ? renderTemplate`${renderComponent($$result2, "CustomersTable", CustomersTable, { "data": customers })}` : renderTemplate`<p class="font-medium text-muted-foreground">
No customers yet. Try creating one using the API or by selecting "Create New Customer" above.
</p>`} ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/customers.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/customers.astro";
const $$url = "/admin/customers";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Customers,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=customers.astro.mjs.map
