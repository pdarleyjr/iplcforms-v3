import { FormSubmissionService } from "@/lib/services/form_submission";
import { validateApiTokenResponse } from "@/lib/api";

export async function GET({ locals, params, request }: any) {
  const { id } = params;
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const formSubmissionService = new FormSubmissionService(DB);
  const submission = await formSubmissionService.getById(parseInt(id, 10));

  if (!submission) {
    return Response.json({ message: "Form submission not found" }, { status: 404 });
  }

  return Response.json({ submission });
}

export async function PUT({ locals, params, request }: any) {
  const { id } = params;
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const formSubmissionService = new FormSubmissionService(DB);

  try {
    const body = await request.json();
    const result = await formSubmissionService.update(parseInt(id, 10), body);
    
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

export async function DELETE({ locals, params, request }: any) {
  const { id } = params;
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

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