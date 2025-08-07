globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, b as renderTemplate, a2 as renderSlot, r as renderComponent, a3 as renderHead, a4 as addAttribute } from './astro/server_CGOudIm3.mjs';
/* empty css                         */
import { A as ApiTokenMissingCard, H as Header } from './api-token-missing-card_DEE6X43B.mjs';
import { j as jsxRuntimeExports } from './jsx-runtime_DoH26EBh.mjs';
import { a as reactExports } from './_@astro-renderers_DXs7ZzLR.mjs';
import { e as cn } from './card_Bkkbi2m7.mjs';
import './button_CZXiuir8.mjs';
import { c as createLucideIcon } from './createLucideIcon_ClZSvR28.mjs';
import { C as ChevronRight, X } from './tabs_D750p8T4.mjs';
import { L as LayoutDashboard, U as Users } from './users_Ivw_eqb5.mjs';
import { F as FileText } from './file-text_BQsr4aDC.mjs';
import { M as MessageSquare } from './message-square_CUbX5KZO.mjs';

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$2);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 18h16", key: "19g7jn" }],
  ["path", { d: "M4 6h16", key: "1o0s65" }]
];
const Menu = createLucideIcon("menu", __iconNode$1);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);

const sidebarLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics"
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
    description: "Manage customer accounts"
  },
  {
    href: "/admin/subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
    description: "Billing and plans"
  },
  {
    href: "/forms",
    label: "Forms",
    icon: FileText,
    description: "Form builder and templates"
  },
  {
    href: "/chat",
    label: "AI Chat",
    icon: MessageSquare,
    description: "Document assistant",
    badge: "New"
  },
  {
    href: "/admin/integrations",
    label: "Integrations",
    icon: Settings,
    description: "Third-party connections"
  }
];
function Sidebar({ currentPath }) {
  const [isCollapsed, setIsCollapsed] = reactExports.useState(false);
  const [isMobile, setIsMobile] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    isMobile && !isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-40 md:hidden",
        onClick: toggleSidebar
      }
    ),
    isMobile && isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: toggleSidebar,
        className: "fixed left-4 top-20 z-50 w-12 h-12 rounded-lg bg-[#153F81] hover:bg-[#1a4a94] iplc-shadow-lg flex items-center justify-center transition-all group",
        "aria-label": "Open menu",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-6 w-6 text-white group-hover:scale-110 transition-transform" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: cn(
          "relative h-full bg-[#153F81] transition-all duration-300 ease-in-out z-50",
          "flex flex-col iplc-shadow-xl",
          isCollapsed ? "w-16" : "w-64",
          isMobile && "fixed top-16",
          isMobile ? isCollapsed ? "-left-64" : "left-0" : ""
        ),
        children: [
          !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: toggleSidebar,
              className: cn(
                "absolute top-6 z-10 h-6 w-6 rounded-full bg-white iplc-shadow-md flex items-center justify-center hover:scale-110 transition-transform",
                isCollapsed ? "-right-10" : "-right-3"
              ),
              "aria-label": isCollapsed ? "Expand sidebar" : "Collapse sidebar",
              children: isCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-[#153F81]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 text-[#153F81]" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
            "border-b border-white/10",
            isCollapsed ? "p-2" : "p-4"
          ), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-between"
          ), children: isMobile && !isCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: toggleSidebar,
              className: "w-12 h-12 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group",
              "aria-label": "Close sidebar",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-6 w-6 text-white group-hover:scale-110 transition-transform" })
            }
          ) : !isCollapsed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg gradient-metallic-gold flex items-center justify-center iplc-shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#153F81] font-bold text-sm", children: "IP" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white font-semibold", children: "IPLC Admin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[#219FD9] text-xs", children: "Clinical Forms" })
            ] })
          ] }) : null }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 overflow-y-auto p-3 space-y-1", children: sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.href;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: link.href,
                className: cn(
                  "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  "hover:bg-white/10",
                  isActive && "bg-gradient-to-r from-[#219FD9]/20 to-[#27599F]/20 border-l-4 border-[#F9C04D]",
                  isCollapsed && "justify-center px-2"
                ),
                title: isCollapsed ? link.label : void 0,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Icon,
                    {
                      className: cn(
                        "flex-shrink-0 transition-colors",
                        isActive ? "text-[#F9C04D]" : "text-[#219FD9] group-hover:text-white",
                        !isCollapsed && "mr-3",
                        "h-5 w-5"
                      )
                    }
                  ),
                  !isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                        "transition-colors",
                        isActive ? "text-white" : "text-[#C9D4D5] group-hover:text-white"
                      ), children: link.label }),
                      link.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-metallic-gold text-[#153F81]", children: link.badge })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#92969C] mt-0.5 group-hover:text-[#C9D4D5]", children: link.description })
                  ] })
                ]
              },
              link.href
            );
          }) }),
          !isCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-gradient-to-r from-[#219FD9]/10 to-[#27599F]/10 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#C9D4D5] mb-1", children: "System Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-[#80C97B] animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white font-medium", children: "All systems operational" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#219FD9]/30 to-transparent" })
        ]
      }
    )
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const currentPath = Astro2.url.pathname;
  const title = Astro2.props.title || "IPLC Forms Admin";
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
</script> <html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"`, "><title>", "</title>", '</head> <body class="min-h-screen bg-gray-50"> ', ' <div class="flex h-[calc(100vh-4rem)]"> <!-- Sidebar --> ', ' <!-- Main content area --> <main class="flex-1 overflow-y-auto"> <div class="p-8"> <div class="mb-4"> ', ' </div> <div class="flex items-center justify-between mb-6"> ', " </div> ", ` </div> </main> </div> <!-- Subtle noise texture overlay --> <div class="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=" 0 0 256 256" xmlns="http://www.w3.org/2000/svg" %3E%3Cfilter id="noiseFilter" %3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" %3E%3C filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" %3E%3C svg%3E');"></div> </body></html>`])), addAttribute(Astro2.generator, "content"), `${title} - IPLC Forms` , renderHead(), renderComponent($$result, "Header", Header, { "currentPath": currentPath }), renderComponent($$result, "Sidebar", Sidebar, { "currentPath": currentPath, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/admin/Sidebar", "client:component-export": "default" }), !apiTokenSet && renderTemplate`${renderComponent($$result, "ApiTokenMissingCard", ApiTokenMissingCard, {})}`, renderSlot($$result, $$slots["actions"]), renderSlot($$result, $$slots["default"]));
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
//# sourceMappingURL=AdminLayout_ROplkpJq.mjs.map
