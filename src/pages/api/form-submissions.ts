import type { APIContext, APIRoute } from "astro";
import { FormSubmissionService } from "@/lib/services/form_submission";
import { authenticate, authorize } from "@/lib/middleware/rbac-middleware";
import { PERMISSIONS } from "@/lib/utils/rbac";
import {
  FormSubmissionFiltersSchema,
  CreateFormSubmissionRequest,
  validateRequest,
  validateQueryParams
} from "@/lib/schemas/api-validation";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";

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
    const submissions = await formSubmissionService.getAll(filters);
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
  const { DB } = (context.locals as any).runtime.env;
  
  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.CREATE, 'form_submissions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  const formSubmissionService = new FormSubmissionService(DB);
  
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