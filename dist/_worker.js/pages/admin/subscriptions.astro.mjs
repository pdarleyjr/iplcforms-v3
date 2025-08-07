globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CGOudIm3.mjs';
import { $ as $$Layout } from '../../chunks/Layout_C6d5n2BC.mjs';
import { S as SubscriptionService } from '../../chunks/subscription_Dua9-wUJ.mjs';
import { j as jsxRuntimeExports } from '../../chunks/jsx-runtime_DoH26EBh.mjs';
import { u as useReactTable, g as getCoreRowModel, D as DataTable } from '../../chunks/data-table_DzbGGvZL.mjs';
import { B as Badge } from '../../chunks/badge_Cm5Qu_Jj.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const getSubscriptionTier = (name, price) => {
  const lowerName = name.toLowerCase();
  if (price === 0 || lowerName.includes("free") || lowerName.includes("trial")) return "Basic";
  if (price > 100 || lowerName.includes("enterprise") || lowerName.includes("premium")) return "Enterprise";
  if (lowerName.includes("clinical") || lowerName.includes("therapy") || lowerName.includes("professional")) return "Clinical";
  return "Professional";
};
const getSubscriptionStatus = (subscription) => {
  if (subscription.status) {
    const status = subscription.status.toLowerCase();
    if (status === "trial") return "Trial";
    if (status === "expired" || status === "cancelled") return "Expired";
    if (status === "inactive") return "Inactive";
  }
  return "Active";
};
const getTierBadgeVariant = (tier) => {
  switch (tier) {
    case "Basic":
      return "outline";
    case "Professional":
      return "default";
    case "Clinical":
      return "destructive";
    case "Enterprise":
      return "secondary";
    default:
      return "outline";
  }
};
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Active":
      return "default";
    case "Trial":
      return "secondary";
    case "Inactive":
      return "outline";
    case "Expired":
      return "destructive";
    default:
      return "outline";
  }
};
const columns = [
  {
    accessorKey: "id",
    header: "Plan ID",
    cell: ({ getValue }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium", children: String(getValue()).slice(-2) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
        "#",
        getValue()
      ] })
    ] })
  },
  {
    accessorKey: "name",
    header: "Subscription Plan",
    cell: ({ getValue, row }) => {
      const name = getValue();
      const tier = getSubscriptionTier(name, row.original.price);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            className: "text-sm font-medium text-primary hover:text-primary/80 transition-colors",
            href: `/admin/subscriptions/${row.original.id}`,
            children: name
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: getTierBadgeVariant(tier), className: "text-xs", children: tier }),
          row.original.subscribers && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            row.original.subscribers,
            " subscribers"
          ] })
        ] })
      ] });
    }
  },
  {
    accessorKey: "description",
    header: "Clinical Features",
    cell: ({ getValue, row }) => {
      const description = getValue();
      const features = row.original.features || [];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground line-clamp-2", children: description }),
        features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
          features.slice(0, 2).map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: feature }, index)),
          features.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
            "+",
            features.length - 2,
            " more"
          ] })
        ] })
      ] });
    }
  },
  {
    accessorKey: "price",
    header: "Monthly Rate",
    cell: ({ getValue, row }) => {
      const price = getValue();
      const tier = getSubscriptionTier(row.original.name, price);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold text-foreground", children: [
          price === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600", children: "Free" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "$",
            price.toFixed(2)
          ] }),
          price > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "/month" })
        ] }),
        tier === "Clinical" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "HIPAA Compliant" })
      ] });
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = getSubscriptionStatus(row.original);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: getStatusBadgeVariant(status), className: "text-xs", children: status }),
        status === "Active" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-green-600", children: "● Available for signup" }),
        status === "Trial" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-blue-600", children: "● 14-day trial period" })
      ] });
    }
  },
  {
    accessorKey: "created_at",
    header: "Launch Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue());
      const now = /* @__PURE__ */ new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground", children: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: diffDays < 30 ? `${diffDays} days ago` : diffDays < 365 ? `${Math.floor(diffDays / 30)} months ago` : `${Math.floor(diffDays / 365)} years ago` })
      ] });
    }
  }
];
function SubscriptionsTable({ data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-slate-200/80 dark:border-slate-700/30 bg-gradient-to-br from-slate-50/90 to-slate-100/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b border-slate-200/80 dark:border-slate-700/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent", children: "Clinical Subscription Plans" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400 mt-1", children: "Manage healthcare professional subscription tiers and billing" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs border-slate-300/50 dark:border-slate-600/50 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50", children: [
          data.length,
          " Plans"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "default", className: "text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm", children: [
          data.filter((sub) => getSubscriptionStatus(sub) === "Active").length,
          " Active"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DataTable, { table })
  ] });
}

const $$Astro = createAstro();
const prerender = false;
const $$Subscriptions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Subscriptions;
  const { API_TOKEN, DB } = Astro2.locals.env || {};
  const subscriptionService = new SubscriptionService(DB);
  const subscriptions = await subscriptionService.getAll();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Subscriptions" }, { "actions": async ($$result2) => renderTemplate`${maybeRenderHead()}<div> ${renderComponent($$result2, "CreateSubscriptionButton", null, { "apiToken": API_TOKEN, "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/components/admin/create-subscription", "client:component-export": "CreateSubscriptionButton" })} </div>`, "default": async ($$result2) => renderTemplate`${subscriptions.length ? renderTemplate`${renderComponent($$result2, "SubscriptionsTable", SubscriptionsTable, { "data": subscriptions })}` : renderTemplate`<p class="font-medium text-muted-foreground">
No subscriptions yet. Try creating one using the API or by selecting "Create New Subscription" above.
</p>`} ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/subscriptions.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/subscriptions.astro";
const $$url = "/admin/subscriptions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Subscriptions,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=subscriptions.astro.mjs.map
