globalThis.process ??= {}; globalThis.process.env ??= {};
import { j as jsxRuntimeExports } from './react-vendor_BBaf1uT2.mjs';
import { e as cn, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from './card_DRaKdq96.mjs';

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/subscriptions", label: "Subscriptions" }
];
function Header({ currentPath }) {
  const isAdminSection = currentPath.startsWith("/admin") || currentPath.startsWith("/forms");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative border-b border-gray-200/30 bg-white iplc-shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center justify-between mx-6 h-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4 lg:space-x-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "group relative inline-flex items-center transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#219FD9] focus:ring-offset-2 rounded-lg",
          "aria-label": "FormPro Home",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/iplc-logo.png",
              alt: "IPLC Logo",
              className: "h-10 w-auto object-contain"
            }
          )
        }
      ),
      isAdminSection && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-px bg-gradient-to-b from-transparent via-[#C9D4D5] to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-1 lg:space-x-2", children: links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            className: cn(
              "relative overflow-hidden px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
              currentPath === link.href ? "text-[#27599F]" : "text-[#92969C] hover:text-[#219FD9]"
            ),
            href: link.href,
            "aria-current": currentPath === link.href ? "page" : void 0,
            children: [
              currentPath === link.href && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 bg-gradient-to-r from-[#219FD9]/10 to-[#27599F]/10 rounded-lg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10", children: link.label }),
              currentPath === link.href && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0 left-3 right-3 h-0.5 gradient-metallic-primary rounded-full" })
            ]
          },
          link.href
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center space-x-2 text-xs text-[#92969C]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-[#80C97B] animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "System Active" })
    ] }) })
  ] }) });
}

const ApiTokenMissingCard = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("space-y-4", "border-red-500"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "API token not configured" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Requests to the API, including from the frontend UI, will not work until an API token is configured." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "Please configure an API token by setting a",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          className: "text-primary underline",
          href: "https://developers.cloudflare.com/workers/configuration/secrets/",
          children: "secret"
        }
      ),
      " ",
      "named ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "API_TOKEN" }),
      "."
    ] }) })
  ] });
};

export { ApiTokenMissingCard as A, Header as H };
//# sourceMappingURL=api-token-missing-card_BGvZpsvs.mjs.map
