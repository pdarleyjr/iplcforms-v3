globalThis.process ??= {}; globalThis.process.env ??= {};
import { F as FormSubmissionService } from '../../chunks/form_submission_DFkhSEjI.mjs';
import { F as FormTemplateService } from '../../chunks/form_template_whHHz9qG.mjs';
import { a as authenticate, b as authorize } from '../../chunks/rbac-middleware_C5PL4AHx.mjs';
import { P as PERMISSIONS } from '../../chunks/rbac_vK5lyOl9.mjs';
import { v as validateQueryParams, F as FormSubmissionFiltersSchema, a as validateRequest, c as CreateFormSubmissionRequest } from '../../chunks/api-validation_EhNMe3Jy.mjs';
import { w as withPerformanceMonitoring } from '../../chunks/performance-wrapper_COlTcJLx.mjs';
import { s as sendSlackNotification } from '../../chunks/slack_C2T7VPPC.mjs';
import { s as sendEmail } from '../../chunks/email_DRCgJDbp.mjs';
import { s as sendWebhook } from '../../chunks/webhook_C4BbeMYT.mjs';
export { renderers } from '../../renderers.mjs';

const getHandler = async (context) => {
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.READ, "form_submissions");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const formSubmissionService = new FormSubmissionService(DB);
  try {
    const url = new URL(context.request.url);
    const filtersValidation = validateQueryParams(url, FormSubmissionFiltersSchema);
    if (!filtersValidation.success) {
      return Response.json(
        {
          message: "Invalid query parameters",
          errors: filtersValidation.errors
        },
        { status: 400 }
      );
    }
    const filters = filtersValidation.data;
    const submissions = await formSubmissionService.getAll(filters);
    return Response.json({ submissions });
  } catch (error) {
    console.error("Error loading form submissions:", error);
    return Response.json(
      { message: "Couldn't load form submissions" },
      { status: 500 }
    );
  }
};
const postHandler = async (context) => {
  const { DB, CACHE_KV } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.CREATE, "form_submissions");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const formSubmissionService = new FormSubmissionService(DB);
  const formTemplateService = new FormTemplateService(DB);
  try {
    const body = await context.request.json();
    const validation = validateRequest(CreateFormSubmissionRequest, body);
    if (!validation.success) {
      return Response.json(
        {
          message: "Invalid request data",
          errors: validation.errors
        },
        { status: 400 }
      );
    }
    const submissionData = {
      template_id: validation.data.template_id,
      patient_id: validation.data.user_id ? parseInt(validation.data.user_id) : void 0,
      responses: validation.data.form_data,
      status: validation.data.status,
      completion_time_seconds: void 0,
      submitted_by: Number(authResult.locals.customerId),
      metadata: validation.data.metadata
    };
    const result = await formSubmissionService.create(submissionData);
    if (result.success) {
      const template = await formTemplateService.getById(validation.data.template_id);
      const formTitle = template?.title || "Untitled Form";
      const notificationPromises = [];
      const slackConfig = await CACHE_KV.get("integration:slack:config");
      if (slackConfig) {
        notificationPromises.push(
          sendSlackNotification(CACHE_KV, formTitle, result.submissionId, validation.data.form_data).catch((err) => console.error("Slack notification failed:", err))
        );
      }
      const emailConfig = await CACHE_KV.get("integration:email:config");
      if (emailConfig) {
        notificationPromises.push(
          sendEmail(CACHE_KV, formTitle, result.submissionId.toString(), validation.data.form_data).catch((err) => console.error("Email notification failed:", err))
        );
      }
      const webhookConfig = await CACHE_KV.get("integration:webhook:config");
      if (webhookConfig) {
        notificationPromises.push(
          sendWebhook(CACHE_KV, formTitle, result.submissionId, validation.data.form_data).catch((err) => console.error("Webhook notification failed:", err))
        );
      }
      const nextcloudConfig = await CACHE_KV.get("integration:nextcloud:config");
      if (nextcloudConfig) {
        const exportUrl = new URL("/api/export/nextcloud", context.url);
        notificationPromises.push(
          fetch(exportUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Forward auth headers for internal API call
              "Authorization": context.request.headers.get("Authorization") || ""
            },
            body: JSON.stringify({
              formTitle,
              submissionId: result.submissionId,
              data: validation.data.form_data,
              format: "json"
            })
          }).then((res) => res.ok ? res.json() : Promise.reject("Nextcloud export failed")).catch((err) => console.error("Nextcloud export failed:", err))
        );
      }
      Promise.all(notificationPromises).catch(
        (err) => console.error("Some notifications failed:", err)
      );
      return Response.json({
        message: "Form submission created successfully",
        submission_id: result.submissionId,
        calculated_score: result.calculated_score
      }, { status: 201 });
    } else {
      return Response.json(
        { message: "Failed to create form submission" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating form submission:", error);
    return Response.json(
      { message: "Couldn't create form submission" },
      { status: 500 }
    );
  }
};
const GET = withPerformanceMonitoring(getHandler, "form-submissions:list");
const POST = withPerformanceMonitoring(postHandler, "form-submissions:create");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=form-submissions.astro.mjs.map
