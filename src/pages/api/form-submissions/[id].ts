import { FormSubmissionService } from "@/lib/services/form_submission";
import { authenticate, authorize } from "@/lib/middleware/rbac-middleware";
import { PERMISSIONS } from "@/lib/utils/rbac";
import { UpdateFormSubmissionRequest, validateRequest } from "@/lib/schemas/api-validation";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";
import type { APIContext, APIRoute } from "astro";

const getHandler: APIRoute = async (context: APIContext) => {
  const { id } = context.params;
  const { DB } = (context.locals as any).runtime.env;

  if (!id) {
    return Response.json({ message: "Form submission ID is required" }, { status: 400 });
  }

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.READ, 'form_submissions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  const formSubmissionService = new FormSubmissionService(DB);
  const submission = await formSubmissionService.getById(parseInt(id, 10));

  if (!submission) {
    return Response.json({ message: "Form submission not found" }, { status: 404 });
  }

  return Response.json({ submission });
}

const putHandler: APIRoute = async (context: APIContext) => {
  const { id } = context.params;
  const { DB } = (context.locals as any).runtime.env;

  if (!id) {
    return Response.json({ message: "Form submission ID is required" }, { status: 400 });
  }

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.UPDATE, 'form_submissions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  const formSubmissionService = new FormSubmissionService(DB);

  try {
    const body = await context.request.json();
    
    // Validate request body using Zod schema
    const validationResult = validateRequest(UpdateFormSubmissionRequest, body);
    
    if (!validationResult.success) {
      return Response.json(
        {
          message: "Invalid request data",
          errors: validationResult.errors
        },
        { status: 400 }
      );
    }

    const result = await formSubmissionService.update(parseInt(id, 10), validationResult.data as {
      responses?: object;
      status?: string;
      completion_time_seconds?: number;
      metadata?: object;
    });
    
    if (!result.success) {
      return Response.json({ message: "Form submission not found" }, { status: 404 });
    }

    // Get the updated submission to return
    const updatedSubmission = await formSubmissionService.getById(parseInt(id, 10));

    return Response.json({
      message: "Form submission updated successfully",
      submission: updatedSubmission,
      calculated_score: result.calculated_score,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Submission not found") {
      return Response.json({ message: "Form submission not found" }, { status: 404 });
    }
    
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to update form submission",
        success: false,
      },
      { status: 500 },
    );
  }
}

const deleteHandler: APIRoute = async (context: APIContext) => {
  const { id } = context.params;
  const { DB } = (context.locals as any).runtime.env;

  if (!id) {
    return Response.json({ message: "Form submission ID is required" }, { status: 400 });
  }

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize request
  const authzMiddleware = authorize(PERMISSIONS.DELETE, 'form_submissions');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  const formSubmissionService = new FormSubmissionService(DB);

  try {
    // Mark submission as deleted instead of hard delete for audit purposes
    const result = await formSubmissionService.updateStatus(parseInt(id, 10), 'deleted');
    
    if (!result.success) {
      return Response.json({ message: "Form submission not found" }, { status: 404 });
    }

    return Response.json({
      message: "Form submission deleted successfully",
      success: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Failed to update submission status") {
      return Response.json({ message: "Form submission not found" }, { status: 404 });
    }
    
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to delete form submission",
        success: false,
      },
      { status: 500 },
    );
  }
}

export const GET = withPerformanceMonitoring(getHandler, 'form-submissions:get');
export const PUT = withPerformanceMonitoring(putHandler, 'form-submissions:update');
export const DELETE = withPerformanceMonitoring(deleteHandler, 'form-submissions:delete');