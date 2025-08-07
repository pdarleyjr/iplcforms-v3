globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_DXs7ZzLR.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_kiGDkOgC.mjs';
import { manifest } from './manifest_Ckfqe6Z-.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/customers/_id_.astro.mjs');
const _page2 = () => import('./pages/admin/customers.astro.mjs');
const _page3 = () => import('./pages/admin/integrations.astro.mjs');
const _page4 = () => import('./pages/admin/permissions.astro.mjs');
const _page5 = () => import('./pages/admin/subscriptions/_id_.astro.mjs');
const _page6 = () => import('./pages/admin/subscriptions.astro.mjs');
const _page7 = () => import('./pages/admin/users.astro.mjs');
const _page8 = () => import('./pages/admin.astro.mjs');
const _page9 = () => import('./pages/api/admin/permissions.astro.mjs');
const _page10 = () => import('./pages/api/admin/sse-metrics.astro.mjs');
const _page11 = () => import('./pages/api/admin/users/_id_/role.astro.mjs');
const _page12 = () => import('./pages/api/admin/users.astro.mjs');
const _page13 = () => import('./pages/api/analytics/forms.astro.mjs');
const _page14 = () => import('./pages/api/analytics/plausible.astro.mjs');
const _page15 = () => import('./pages/api/chat/conversations.astro.mjs');
const _page16 = () => import('./pages/api/chat/documents/_id_.astro.mjs');
const _page17 = () => import('./pages/api/chat/documents.astro.mjs');
const _page18 = () => import('./pages/api/chat/export.astro.mjs');
const _page19 = () => import('./pages/api/chat/health.astro.mjs');
const _page20 = () => import('./pages/api/chat/outline.astro.mjs');
const _page21 = () => import('./pages/api/chat/query.astro.mjs');
const _page22 = () => import('./pages/api/chat/share.astro.mjs');
const _page23 = () => import('./pages/api/chat/upload.astro.mjs');
const _page24 = () => import('./pages/api/chat.astro.mjs');
const _page25 = () => import('./pages/api/customer_subscriptions.astro.mjs');
const _page26 = () => import('./pages/api/customers/_id_/workflow.astro.mjs');
const _page27 = () => import('./pages/api/customers/_id_.astro.mjs');
const _page28 = () => import('./pages/api/customers.astro.mjs');
const _page29 = () => import('./pages/api/dashboard/overview.astro.mjs');
const _page30 = () => import('./pages/api/documents/list.astro.mjs');
const _page31 = () => import('./pages/api/documents/upload.astro.mjs');
const _page32 = () => import('./pages/api/export/nextcloud.astro.mjs');
const _page33 = () => import('./pages/api/form-locks.astro.mjs');
const _page34 = () => import('./pages/api/form-sessions.astro.mjs');
const _page35 = () => import('./pages/api/form-submissions/_id_.astro.mjs');
const _page36 = () => import('./pages/api/form-submissions.astro.mjs');
const _page37 = () => import('./pages/api/form-summary.astro.mjs');
const _page38 = () => import('./pages/api/form-summary-live.astro.mjs');
const _page39 = () => import('./pages/api/form-templates/_id_/versions.astro.mjs');
const _page40 = () => import('./pages/api/form-templates/_id_.astro.mjs');
const _page41 = () => import('./pages/api/form-templates.astro.mjs');
const _page42 = () => import('./pages/api/integrations/email.astro.mjs');
const _page43 = () => import('./pages/api/integrations/nextcloud.astro.mjs');
const _page44 = () => import('./pages/api/integrations/slack.astro.mjs');
const _page45 = () => import('./pages/api/integrations/status.astro.mjs');
const _page46 = () => import('./pages/api/integrations/webhook.astro.mjs');
const _page47 = () => import('./pages/api/performance-metrics.astro.mjs');
const _page48 = () => import('./pages/api/plausible/api/event.astro.mjs');
const _page49 = () => import('./pages/api/plausible/script.js.astro.mjs');
const _page50 = () => import('./pages/api/subscriptions/_id_.astro.mjs');
const _page51 = () => import('./pages/api/subscriptions.astro.mjs');
const _page52 = () => import('./pages/api/test-ai-binding.astro.mjs');
const _page53 = () => import('./pages/api/workflow.astro.mjs');
const _page54 = () => import('./pages/chat/shared/_id_.astro.mjs');
const _page55 = () => import('./pages/chat.astro.mjs');
const _page56 = () => import('./pages/chat-public.astro.mjs');
const _page57 = () => import('./pages/dev/phase0-smoke.astro.mjs');
const _page58 = () => import('./pages/forms/new.astro.mjs');
const _page59 = () => import('./pages/forms/_id_/analytics.astro.mjs');
const _page60 = () => import('./pages/forms/_id_/edit.astro.mjs');
const _page61 = () => import('./pages/forms/_id_/preview.astro.mjs');
const _page62 = () => import('./pages/forms/_id_/submissions/_submissionid_.astro.mjs');
const _page63 = () => import('./pages/forms.astro.mjs');
const _page64 = () => import('./pages/health.astro.mjs');
const _page65 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/admin/customers/[id].astro", _page1],
    ["src/pages/admin/customers.astro", _page2],
    ["src/pages/admin/integrations.astro", _page3],
    ["src/pages/admin/permissions.astro", _page4],
    ["src/pages/admin/subscriptions/[id].astro", _page5],
    ["src/pages/admin/subscriptions.astro", _page6],
    ["src/pages/admin/users.astro", _page7],
    ["src/pages/admin/index.astro", _page8],
    ["src/pages/api/admin/permissions.ts", _page9],
    ["src/pages/api/admin/sse-metrics.ts", _page10],
    ["src/pages/api/admin/users/[id]/role.ts", _page11],
    ["src/pages/api/admin/users.ts", _page12],
    ["src/pages/api/analytics/forms.ts", _page13],
    ["src/pages/api/analytics/plausible.ts", _page14],
    ["src/pages/api/chat/conversations.ts", _page15],
    ["src/pages/api/chat/documents/[id].ts", _page16],
    ["src/pages/api/chat/documents.ts", _page17],
    ["src/pages/api/chat/export.ts", _page18],
    ["src/pages/api/chat/health.ts", _page19],
    ["src/pages/api/chat/outline.ts", _page20],
    ["src/pages/api/chat/query.ts", _page21],
    ["src/pages/api/chat/share.ts", _page22],
    ["src/pages/api/chat/upload.ts", _page23],
    ["src/pages/api/chat.ts", _page24],
    ["src/pages/api/customer_subscriptions.ts", _page25],
    ["src/pages/api/customers/[id]/workflow.ts", _page26],
    ["src/pages/api/customers/[id].ts", _page27],
    ["src/pages/api/customers.ts", _page28],
    ["src/pages/api/dashboard/overview.ts", _page29],
    ["src/pages/api/documents/list.ts", _page30],
    ["src/pages/api/documents/upload.ts", _page31],
    ["src/pages/api/export/nextcloud.ts", _page32],
    ["src/pages/api/form-locks.ts", _page33],
    ["src/pages/api/form-sessions.ts", _page34],
    ["src/pages/api/form-submissions/[id].ts", _page35],
    ["src/pages/api/form-submissions.ts", _page36],
    ["src/pages/api/form-summary.ts", _page37],
    ["src/pages/api/form-summary-live.ts", _page38],
    ["src/pages/api/form-templates/[id]/versions.ts", _page39],
    ["src/pages/api/form-templates/[id].ts", _page40],
    ["src/pages/api/form-templates.ts", _page41],
    ["src/pages/api/integrations/email.ts", _page42],
    ["src/pages/api/integrations/nextcloud.ts", _page43],
    ["src/pages/api/integrations/slack.ts", _page44],
    ["src/pages/api/integrations/status.ts", _page45],
    ["src/pages/api/integrations/webhook.ts", _page46],
    ["src/pages/api/performance-metrics.ts", _page47],
    ["src/pages/api/plausible/api/event.ts", _page48],
    ["src/pages/api/plausible/script.js.ts", _page49],
    ["src/pages/api/subscriptions/[id].ts", _page50],
    ["src/pages/api/subscriptions.ts", _page51],
    ["src/pages/api/test-ai-binding.ts", _page52],
    ["src/pages/api/workflow.ts", _page53],
    ["src/pages/chat/shared/[id].astro", _page54],
    ["src/pages/chat.astro", _page55],
    ["src/pages/chat-public.astro", _page56],
    ["src/pages/dev/phase0-smoke.astro", _page57],
    ["src/pages/forms/new.astro", _page58],
    ["src/pages/forms/[id]/analytics.astro", _page59],
    ["src/pages/forms/[id]/edit.astro", _page60],
    ["src/pages/forms/[id]/preview.astro", _page61],
    ["src/pages/forms/[id]/submissions/[submissionId].astro", _page62],
    ["src/pages/forms/index.astro", _page63],
    ["src/pages/health.ts", _page64],
    ["src/pages/index.astro", _page65]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const CustomerWorkflow = _exports['CustomerWorkflow'];
const FormSessionDO = _exports['FormSessionDO'];
const AIGate = _exports['AIGate'];
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { AIGate, CustomerWorkflow, FormSessionDO, __astrojsSsrVirtualEntry as default, pageMap };
//# sourceMappingURL=index.js.map
