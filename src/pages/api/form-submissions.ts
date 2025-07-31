import type { APIContext, APIRoute } from "astro";
import { FormSubmissionService } from "@/lib/services/form_submission";
import { FormTemplateService } from "@/lib/services/form_template";
import { authenticate, authorize } from "@/lib/middleware/rbac-middleware";
import { PERMISSIONS } from "@/lib/utils/rbac";
import {
  FormSubmissionFiltersSchema,
  CreateFormSubmissionRequest,
  validateRequest,
  validateQueryParams
} from "@/lib/schemas/api-validation";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";
import { sendSlackNotification } from "./integrations/slack";
import { sendEmail } from "./integrations/email";
import { sendWebhook } from "./integrations/webhook";

const getHandler: APIRoute = async (context: APIContext) => {
  const { DB } = (context.locals as any).runtime.env;
  
  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.READ, 'form_submissions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  const formSubmissionService = new FormSubmissionService(DB);
  
  try {
    // Validate query parameters using Zod schema
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
    const submissions = await formSubmissionService.getAll(filters as any);
    return Response.json({ submissions });
  } catch (error) {
    console.error('Error loading form submissions:', error);
    return Response.json(
      { message: "Couldn't load form submissions" },
      { status: 500 }
    );
  }
};

const postHandler: APIRoute = async (context: APIContext) => {
  const { DB, CACHE_KV } = (context.locals as any).runtime.env;
  
  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.CREATE, 'form_submissions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  const formSubmissionService = new FormSubmissionService(DB);
  const formTemplateService = new FormTemplateService(DB);
  
  try {
    const body = await context.request.json();
    
    // Validate request body using Zod schema
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

    // Transform validated data to match service interface
    const submissionData = {
      template_id: validation.data.template_id,
      patient_id: validation.data.user_id ? parseInt(validation.data.user_id) : undefined,
      responses: validation.data.form_data,
      status: validation.data.status,
      completion_time_seconds: undefined,
      submitted_by: Number(authResult.locals.customerId),
      metadata: validation.data.metadata
    };

    const result = await formSubmissionService.create(submissionData);
    
    if (result.success) {
      // Get form template details for notifications
      const template = await formTemplateService.getById(validation.data.template_id);
      const formTitle = template?.title || 'Untitled Form';
      
      // Trigger notifications and exports in the background
      const notificationPromises: Promise<any>[] = [];
      
      // Check if Slack is configured and send notification
      const slackConfig = await CACHE_KV.get('integration:slack:config');
      if (slackConfig) {
        notificationPromises.push(
          sendSlackNotification(CACHE_KV, formTitle, result.submissionId, validation.data.form_data)
            .catch((err: any) => console.error('Slack notification failed:', err))
        );
      }
      
      // Check if email is configured and send notification
      const emailConfig = await CACHE_KV.get('integration:email:config');
      if (emailConfig) {
        notificationPromises.push(
          sendEmail(CACHE_KV, formTitle, result.submissionId.toString(), validation.data.form_data)
            .catch((err: any) => console.error('Email notification failed:', err))
        );
      }
      
      // Check if webhook is configured and send notification
      const webhookConfig = await CACHE_KV.get('integration:webhook:config');
      if (webhookConfig) {
        notificationPromises.push(
          sendWebhook(CACHE_KV, formTitle, result.submissionId, validation.data.form_data)
            .catch((err: any) => console.error('Webhook notification failed:', err))
        );
      }
      
      // Check if Nextcloud is configured and export data
      const nextcloudConfig = await CACHE_KV.get('integration:nextcloud:config');
      if (nextcloudConfig) {
        const exportUrl = new URL('/api/export/nextcloud', context.url);
        notificationPromises.push(
          fetch(exportUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Forward auth headers for internal API call
              'Authorization': context.request.headers.get('Authorization') || ''
            },
            body: JSON.stringify({
              formTitle,
              submissionId: result.submissionId,
              data: validation.data.form_data,
              format: 'json'
            })
          })
          .then(res => res.ok ? res.json() : Promise.reject('Nextcloud export failed'))
          .catch((err: any) => console.error('Nextcloud export failed:', err))
        );
      }
      
      // Execute all notifications in parallel without blocking the response
      Promise.all(notificationPromises).catch((err: any) =>
        console.error('Some notifications failed:', err)
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
    console.error('Error creating form submission:', error);
    return Response.json(
      { message: "Couldn't create form submission" },
      { status: 500 }
    );
  }
};

export const GET = withPerformanceMonitoring(getHandler, 'form-submissions:list');
export const POST = withPerformanceMonitoring(postHandler, 'form-submissions:create');