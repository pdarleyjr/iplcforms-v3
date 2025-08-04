globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, a4 as addAttribute } from '../chunks/astro/server_Cd9lk-7F.mjs';
import { $ as $$Layout } from '../chunks/Layout_CIY5vW_S.mjs';
import { b as buttonVariants } from '../chunks/button_B9vnY3WY.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../chunks/card_CmFEFEbr.mjs';
import { U as Users, L as LayoutDashboard } from '../chunks/users_BcYBx107.mjs';
import { F as FileText } from '../chunks/file-text_mK5S3sjb.mjs';
import { c as createLucideIcon } from '../chunks/createLucideIcon_BcqoDbb6.mjs';
import { S as Shield } from '../chunks/shield_qIIVy2Tj.mjs';
import { C as Check } from '../chunks/check_BlBiI3Is.mjs';
import { U as UserCheck } from '../chunks/user-check_CWRvoTVz.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_BIJ3dQRj.mjs';

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$5 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$5);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$4 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$4);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$3 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$3);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode$2);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["path", { d: "M11 2v2", key: "1539x4" }],
  ["path", { d: "M5 2v2", key: "1yf1q8" }],
  ["path", { d: "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1", key: "rb5t3r" }],
  ["path", { d: "M8 15a6 6 0 0 0 12 0v-3", key: "x18d4x" }],
  ["circle", { cx: "20", cy: "10", r: "2", key: "ts1r5v" }]
];
const Stethoscope = createLucideIcon("stethoscope", __iconNode$1);

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
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  let dashboardStats = {
    activePatients: 0,
    formsCreated: 0,
    completionRate: "0.0%"
  };
  try {
    const response = await fetch(new URL("/api/dashboard/overview", Astro2.url).href);
    if (response.ok) {
      dashboardStats = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
  }
  const features = [
    {
      icon: Users,
      title: "Patient Management",
      description: "Comprehensive patient records, demographics, and clinical history tracking."
    },
    {
      icon: FileText,
      title: "Dynamic Forms",
      description: "Create, manage, and deploy clinical forms with real-time validation."
    },
    {
      icon: ChartColumn,
      title: "Analytics Dashboard",
      description: "Track form submissions, completion rates, and clinical metrics."
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure access control with clinical roles and permissions."
    },
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Monitor patient submissions and clinical workflows in real-time."
    },
    {
      icon: Zap,
      title: "Fast & Scalable",
      description: "Built on Cloudflare Workers for global performance and reliability."
    }
  ];
  const benefits = [
    "HIPAA-compliant infrastructure",
    "Automated clinical workflows",
    "Multi-location support",
    "Real-time data synchronization",
    "Customizable form templates",
    "Comprehensive audit trails"
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Home" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative overflow-hidden"> <div class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-20"> <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8"> <div class="flex items-center gap-x-4 mb-8"> <span class="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary">
Clinical Admin System
</span> <span class="inline-flex items-center gap-x-1 text-sm text-muted-foreground"> ${renderComponent($$result2, "Stethoscope", Stethoscope, { "className": "h-4 w-4" })}
Healthcare Ready
</span> </div> <h1 class="text-4xl font-bold tracking-tight sm:text-6xl mb-0" style="font-size: 2.5rem; margin: 0;">
Clinical Forms & Patient Management Platform
</h1> <p class="mt-6 text-lg leading-8 text-muted-foreground">
A comprehensive healthcare administration system built for modern clinical practices. 
          Manage patients, create dynamic forms, track submissions, and maintain compliance 
          with an intuitive, secure platform.
</p> <div class="mt-10 flex items-center gap-x-6"> <a href="/admin"${addAttribute(buttonVariants({ size: "lg" }), "class")}> ${renderComponent($$result2, "LayoutDashboard", LayoutDashboard, { "className": "mr-2 h-5 w-5" })}
Access Admin Dashboard
${renderComponent($$result2, "ArrowRight", ArrowRight, { "className": "ml-2 h-4 w-4" })} </a> <a href="/forms"${addAttribute(buttonVariants({ variant: "outline", size: "lg" }), "class")}> ${renderComponent($$result2, "ClipboardList", ClipboardList, { "className": "mr-2 h-5 w-5" })}
View Forms
</a> </div> </div> <div class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-16"> <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none"> <div class="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-gray-100/5 dark:ring-gray-100/10"> ${renderComponent($$result2, "Card", Card, { "className": "shadow-2xl" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Clinical Admin Dashboard` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`Real-time overview of your clinical operations` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <div className="grid gap-4"> <div className="grid grid-cols-3 gap-4"> <div className="space-y-1"> <p className="text-2xl font-bold">${dashboardStats.activePatients.toLocaleString()}</p> <p className="text-xs text-muted-foreground">Active Patients</p> </div> <div className="space-y-1"> <p className="text-2xl font-bold">${dashboardStats.formsCreated}</p> <p className="text-xs text-muted-foreground">Forms Created</p> </div> <div className="space-y-1"> <p className="text-2xl font-bold">${dashboardStats.completionRate}</p> <p className="text-xs text-muted-foreground">Completion Rate</p> </div> </div> <div className="h-32 bg-muted/20 rounded-md flex items-center justify-center"> ${renderComponent($$result4, "BarChart3", ChartColumn, { "className": "h-8 w-8 text-muted-foreground" })} </div> </div> ` })} ` })} </div> </div> </div> </div> </section>  <section class="py-16 bg-muted/20"> <div class="mx-auto max-w-7xl px-6 lg:px-8"> <div class="mx-auto max-w-2xl text-center"> <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
Everything you need for clinical administration
</h2> <p class="mt-4 text-lg leading-8 text-muted-foreground">
Built specifically for healthcare providers, our platform streamlines patient management and clinical workflows.
</p> </div> <div class="mx-auto mt-16 max-w-7xl"> <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"> ${features.map((feature) => renderTemplate`${renderComponent($$result2, "Card", Card, { "className": "relative" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "feature.icon", feature.icon, { "className": "h-10 w-10 text-primary mb-4" })} ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "text-xl" }, { "default": async ($$result5) => renderTemplate`${feature.title}` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`${feature.description}` })} ` })} ` })}`)} </div> </div> </div> </section>  <section class="py-16"> <div class="mx-auto max-w-7xl px-6 lg:px-8"> <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center"> <div> <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
Built for Healthcare Compliance
</h2> <p class="mt-6 text-lg leading-8 text-muted-foreground">
Our platform is designed with healthcare regulations in mind, ensuring your 
            patient data is secure and your workflows are compliant.
</p> <div className="mt-8 space-y-3"> ${benefits.map((benefit) => renderTemplate`<div className="flex items-center gap-x-3"> ${renderComponent($$result2, "Check", Check, { "className": "h-5 w-5 flex-none text-primary" })} <span className="text-base">${benefit}</span> </div>`)} </div> <div className="mt-10"> <a href="/admin"${addAttribute(buttonVariants(), "class")}>
Get Started
${renderComponent($$result2, "ArrowRight", ArrowRight, { "className": "ml-2 h-4 w-4" })} </a> </div> </div> <div className="relative"> ${renderComponent($$result2, "Card", Card, { "className": "shadow-xl" }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-4" }, { "default": async ($$result4) => renderTemplate` <div className="flex items-center justify-between"> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Quick Actions` })} ${renderComponent($$result4, "UserCheck", UserCheck, { "className": "h-5 w-5 text-muted-foreground" })} </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, { "className": "space-y-4" }, { "default": async ($$result4) => renderTemplate` <a href="/admin/customers" className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"> <div className="flex items-center gap-3"> ${renderComponent($$result4, "Users", Users, { "className": "h-5 w-5 text-primary" })} <span className="font-medium">Manage Patients</span> </div> ${renderComponent($$result4, "ArrowRight", ArrowRight, { "className": "h-4 w-4 text-muted-foreground" })} </a> <a href="/forms" className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"> <div className="flex items-center gap-3"> ${renderComponent($$result4, "FileText", FileText, { "className": "h-5 w-5 text-primary" })} <span className="font-medium">Create Forms</span> </div> ${renderComponent($$result4, "ArrowRight", ArrowRight, { "className": "h-4 w-4 text-muted-foreground" })} </a> <a href="/admin/subscriptions" className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"> <div className="flex items-center gap-3"> ${renderComponent($$result4, "Activity", Activity, { "className": "h-5 w-5 text-primary" })} <span className="font-medium">View Analytics</span> </div> ${renderComponent($$result4, "ArrowRight", ArrowRight, { "className": "h-4 w-4 text-muted-foreground" })} </a> ` })} ` })} </div> </div> </div> </section>  <section class="py-16 bg-primary/5"> <div class="mx-auto max-w-7xl px-6 lg:px-8"> <div class="mx-auto max-w-2xl text-center"> <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
Ready to transform your clinical workflows?
</h2> <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
Join healthcare providers who are streamlining their patient management 
          and clinical documentation with our comprehensive platform.
</p> <div class="mt-10 flex items-center justify-center gap-x-6"> <a href="/admin"${addAttribute(buttonVariants({ size: "lg" }), "class")}> ${renderComponent($$result2, "LayoutDashboard", LayoutDashboard, { "className": "mr-2 h-5 w-5" })}
Start Now
</a> <a href="/forms"${addAttribute(buttonVariants({ variant: "ghost", size: "lg" }), "class")}>
Learn More
${renderComponent($$result2, "ArrowRight", ArrowRight, { "className": "ml-2 h-4 w-4" })} </a> </div> </div> </div> </section> ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/index.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=index.astro.mjs.map
