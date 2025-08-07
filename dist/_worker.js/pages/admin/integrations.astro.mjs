globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as renderScript } from '../../chunks/astro/server_Cd9lk-7F.mjs';
import { $ as $$Layout } from '../../chunks/Layout_Cvn2ksVx.mjs';
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from '../../chunks/card_CmFEFEbr.mjs';
import { B as Button } from '../../chunks/button_B9vnY3WY.mjs';
import { I as Input } from '../../chunks/input_CS4ZXKo0.mjs';
import { L as Label } from '../../chunks/label_Ch9XXvk2.mjs';
import { A as Alert, a as AlertDescription } from '../../chunks/alert_W4kakS3Y.mjs';
import { c as createLucideIcon } from '../../chunks/createLucideIcon_BcqoDbb6.mjs';
import { S as Shield } from '../../chunks/shield_qIIVy2Tj.mjs';
import { M as MessageSquare } from '../../chunks/message-square_ColC9o4y.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]
];
const Cloud = createLucideIcon("cloud", __iconNode$1);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode);

const $$Astro = createAstro();
const $$Integrations = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Integrations;
  const auth = Astro2.request.headers.get("authorization");
  if (!auth) {
    return new Response(null, {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="IPLC Forms"'
      }
    });
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Integrations - IPLC Forms" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto p-6"> <div class="mb-8"> <h1 class="text-3xl font-bold tracking-tight">Third-Party Integrations</h1> <p class="text-muted-foreground mt-2">
Connect IPLC Forms with external services for data export and notifications.
</p> </div> <div class="grid gap-6 md:grid-cols-2"> <!-- Nextcloud Integration --> ${renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` <div class="flex items-center gap-3"> ${renderComponent($$result4, "Cloud", Cloud, { "className": "h-8 w-8 text-primary" })} <div> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Nextcloud Export` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Export form submissions to your Nextcloud instance via WebDAV
` })} </div> </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <form id="nextcloud-form" class="space-y-4"> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "nextcloud-url" }, { "default": async ($$result5) => renderTemplate`Nextcloud URL` })} ${renderComponent($$result4, "Input", Input, { "id": "nextcloud-url", "name": "nextcloudUrl", "type": "url", "placeholder": "https://your-nextcloud.com", "required": true })} <p class="text-sm text-muted-foreground mt-1">
Your Nextcloud instance URL (without trailing slash)
</p> </div> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "nextcloud-username" }, { "default": async ($$result5) => renderTemplate`Username` })} ${renderComponent($$result4, "Input", Input, { "id": "nextcloud-username", "name": "nextcloudUsername", "type": "text", "placeholder": "your-username", "required": true })} </div> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "nextcloud-password" }, { "default": async ($$result5) => renderTemplate`App Password` })} ${renderComponent($$result4, "Input", Input, { "id": "nextcloud-password", "name": "nextcloudPassword", "type": "password", "placeholder": "xxxx-xxxx-xxxx-xxxx", "required": true })} <p class="text-sm text-muted-foreground mt-1">
Use an app-specific password for security
</p> </div> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "nextcloud-path" }, { "default": async ($$result5) => renderTemplate`Export Path` })} ${renderComponent($$result4, "Input", Input, { "id": "nextcloud-path", "name": "nextcloudPath", "type": "text", "placeholder": "/Documents/IPLC Forms", "value": "/Documents/IPLC Forms", "required": true })} <p class="text-sm text-muted-foreground mt-1">
Folder path in Nextcloud where exports will be saved
</p> </div> ${renderComponent($$result4, "Button", Button, { "type": "submit", "className": "w-full" }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "Shield", Shield, { "className": "mr-2 h-4 w-4" })}
Save Nextcloud Configuration
` })} </form> ${renderComponent($$result4, "Alert", Alert, { "id": "nextcloud-status", "className": "mt-4 hidden" }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "AlertDescription", AlertDescription, {})} ` })} ` })} ` })} <!-- Slack Notifications --> ${renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` <div class="flex items-center gap-3"> ${renderComponent($$result4, "MessageSquare", MessageSquare, { "className": "h-8 w-8 text-primary" })} <div> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Slack Notifications` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Get real-time notifications for new form submissions
` })} </div> </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <form id="slack-form" class="space-y-4"> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "slack-webhook" }, { "default": async ($$result5) => renderTemplate`Webhook URL` })} ${renderComponent($$result4, "Input", Input, { "id": "slack-webhook", "name": "slackWebhook", "type": "url", "placeholder": "https://hooks.slack.com/services/...", "required": true })} <p class="text-sm text-muted-foreground mt-1">
Get this from your Slack app's Incoming Webhooks
</p> </div> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "slack-channel" }, { "default": async ($$result5) => renderTemplate`Channel Name (Optional)` })} ${renderComponent($$result4, "Input", Input, { "id": "slack-channel", "name": "slackChannel", "type": "text", "placeholder": "#form-submissions" })} <p class="text-sm text-muted-foreground mt-1">
Override the default webhook channel
</p> </div> ${renderComponent($$result4, "Button", Button, { "type": "submit", "className": "w-full" }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "Shield", Shield, { "className": "mr-2 h-4 w-4" })}
Save Slack Configuration
` })} </form> ${renderComponent($$result4, "Alert", Alert, { "id": "slack-status", "className": "mt-4 hidden" }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "AlertDescription", AlertDescription, {})} ` })} ` })} ` })} <!-- Email Notifications --> ${renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` <div class="flex items-center gap-3"> ${renderComponent($$result4, "Mail", Mail, { "className": "h-8 w-8 text-primary" })} <div> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Email Notifications` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Send form submissions via email using MailChannels
` })} </div> </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <form id="email-form" class="space-y-4"> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "email-to" }, { "default": async ($$result5) => renderTemplate`Recipient Email(s)` })} ${renderComponent($$result4, "Input", Input, { "id": "email-to", "name": "emailTo", "type": "email", "placeholder": "admin@example.com", "required": true })} <p class="text-sm text-muted-foreground mt-1">
Comma-separated for multiple recipients
</p> </div> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "email-from" }, { "default": async ($$result5) => renderTemplate`From Email` })} ${renderComponent($$result4, "Input", Input, { "id": "email-from", "name": "emailFrom", "type": "email", "placeholder": "noreply@iplcforms.com", "value": "noreply@iplcforms.com", "required": true })} </div> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "email-subject" }, { "default": async ($$result5) => renderTemplate`Subject Template` })} ${renderComponent($$result4, "Input", Input, { "id": "email-subject", "name": "emailSubject", "type": "text", "placeholder": "New Form Submission: {formTitle}", "value": "New Form Submission: {formTitle}", "required": true })} <p class="text-sm text-muted-foreground mt-1">
Use ${formTitle} and ${submissionId} as placeholders
</p> </div> ${renderComponent($$result4, "Button", Button, { "type": "submit", "className": "w-full" }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "Shield", Shield, { "className": "mr-2 h-4 w-4" })}
Save Email Configuration
` })} </form> ${renderComponent($$result4, "Alert", Alert, { "id": "email-status", "className": "mt-4 hidden" }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "AlertDescription", AlertDescription, {})} ` })} ` })} ` })} <!-- Webhook Integration --> ${renderComponent($$result2, "Card", Card, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, {}, { "default": async ($$result4) => renderTemplate` <div class="flex items-center gap-3"> ${renderComponent($$result4, "Shield", Shield, { "className": "h-8 w-8 text-primary" })} <div> ${renderComponent($$result4, "CardTitle", CardTitle, {}, { "default": async ($$result5) => renderTemplate`Custom Webhook` })} ${renderComponent($$result4, "CardDescription", CardDescription, {}, { "default": async ($$result5) => renderTemplate`
Send form data to any HTTP endpoint
` })} </div> </div> ` })} ${renderComponent($$result3, "CardContent", CardContent, {}, { "default": async ($$result4) => renderTemplate` <form id="webhook-form" class="space-y-4"> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "webhook-url" }, { "default": async ($$result5) => renderTemplate`Endpoint URL` })} ${renderComponent($$result4, "Input", Input, { "id": "webhook-url", "name": "webhookUrl", "type": "url", "placeholder": "https://api.example.com/webhook", "required": true })} </div> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "webhook-method" }, { "default": async ($$result5) => renderTemplate`HTTP Method` })} <select id="webhook-method" name="webhookMethod" className="w-full rounded-md border border-input bg-background px-3 py-2" required> <option value="POST">POST</option> <option value="PUT">PUT</option> <option value="PATCH">PATCH</option> </select> </div> <div> ${renderComponent($$result4, "Label", Label, { "htmlFor": "webhook-headers" }, { "default": async ($$result5) => renderTemplate`Headers (JSON)` })} <textarea id="webhook-headers" name="webhookHeaders" className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[80px] font-mono text-sm" placeholder="{&quot;Authorization&quot;: &quot;Bearer token&quot;, &quot;Content-Type&quot;: &quot;application/json&quot;}"></textarea> <p class="text-sm text-muted-foreground mt-1">
Optional JSON object with custom headers
</p> </div> ${renderComponent($$result4, "Button", Button, { "type": "submit", "className": "w-full" }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "Shield", Shield, { "className": "mr-2 h-4 w-4" })}
Save Webhook Configuration
` })} </form> ${renderComponent($$result4, "Alert", Alert, { "id": "webhook-status", "className": "mt-4 hidden" }, { "default": async ($$result5) => renderTemplate` ${renderComponent($$result5, "AlertDescription", AlertDescription, {})} ` })} ` })} ` })} </div> </main> ${renderScript($$result2, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/integrations.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/integrations.astro", void 0);

const $$file = "C:/Users/Peter Darley/Desktop/iplcforms-v3/src/pages/admin/integrations.astro";
const $$url = "/admin/integrations";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Integrations,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=integrations.astro.mjs.map
