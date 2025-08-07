globalThis.process ??= {}; globalThis.process.env ??= {};
import { F as FormSubmissionService } from '../../../chunks/form_submission_DFkhSEjI.mjs';
import { a as authenticate, b as authorize } from '../../../chunks/rbac-middleware_CqpNIYMv.mjs';
import { P as PERMISSIONS } from '../../../chunks/rbac_vK5lyOl9.mjs';
import { a as validateRequest, U as UpdateFormSubmissionRequest } from '../../../chunks/api-validation_BmEG2mSm.mjs';
import { w as withPerformanceMonitoring } from '../../../chunks/performance-wrapper_COlTcJLx.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const getHandler = async (context) => {
  const { id } = context.params;
  const { DB } = context.locals.runtime.env;
  if (!id) {
    return Response.json({ message: "Form submission ID is required" }, { status: 400 });
  }
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.READ, "form_submissions");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const formSubmissionService = new FormSubmissionService(DB);
  const submission = await formSubmissionService.getById(parseInt(id, 10));
  if (!submission) {
    return Response.json({ message: "Form submission not found" }, { status: 404 });
  }
  return Response.json({ submission });
};
const putHandler = async (context) => {
  const { id } = context.params;
  const { DB } = context.locals.runtime.env;
  if (!id) {
    return Response.json({ message: "Form submission ID is required" }, { status: 400 });
  }
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.UPDATE, "form_submissions");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const formSubmissionService = new FormSubmissionService(DB);
  try {
    const body = await context.request.json();
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
    const result = await formSubmissionService.update(parseInt(id, 10), validationResult.data);
    if (!result.success) {
      return Response.json({ message: "Form submission not found" }, { status: 404 });
    }
    const updatedSubmission = await formSubmissionService.getById(parseInt(id, 10));
    return Response.json({
      message: "Form submission updated successfully",
      submission: updatedSubmission,
      calculated_score: result.calculated_score,
      success: true
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Submission not found") {
      return Response.json({ message: "Form submission not found" }, { status: 404 });
    }
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to update form submission",
        success: false
      },
      { status: 500 }
    );
  }
};
const deleteHandler = async (context) => {
  const { id } = context.params;
  const { DB } = context.locals.runtime.env;
  if (!id) {
    return Response.json({ message: "Form submission ID is required" }, { status: 400 });
  }
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.DELETE, "form_submissions");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const formSubmissionService = new FormSubmissionService(DB);
  try {
    const result = await formSubmissionService.updateStatus(parseInt(id, 10), "deleted");
    if (!result.success) {
      return Response.json({ message: "Form submission not found" }, { status: 404 });
    }
    return Response.json({
      message: "Form submission deleted successfully",
      success: true
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Failed to update submission status") {
      return Response.json({ message: "Form submission not found" }, { status: 404 });
    }
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to delete form submission",
        success: false
      },
      { status: 500 }
    );
  }
};
const GET = withPerformanceMonitoring(getHandler, "form-submissions:get");
const PUT = withPerformanceMonitoring(putHandler, "form-submissions:update");
const DELETE = withPerformanceMonitoring(deleteHandler, "form-submissions:delete");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_id_.astro.mjs.map
