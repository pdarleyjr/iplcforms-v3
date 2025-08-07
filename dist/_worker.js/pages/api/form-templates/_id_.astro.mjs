globalThis.process ??= {}; globalThis.process.env ??= {};
import { F as FormTemplateService } from '../../../chunks/form_template_whHHz9qG.mjs';
import { a as authenticate, b as authorize } from '../../../chunks/rbac-middleware_CqpNIYMv.mjs';
import { P as PERMISSIONS } from '../../../chunks/rbac_vK5lyOl9.mjs';
import { a as validateRequest, d as FormTemplateSchema } from '../../../chunks/api-validation_BmEG2mSm.mjs';
import { w as withPerformanceMonitoring } from '../../../chunks/performance-wrapper_COlTcJLx.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const getHandler = async (context) => {
  const { locals, params } = context;
  const { id } = params;
  const { DB } = locals.runtime.env;
  if (!id) {
    return Response.json({ message: "Template ID is required" }, { status: 400 });
  }
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.READ, "form_templates");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const formTemplateService = new FormTemplateService(DB);
  const template = await formTemplateService.getById(Number(id));
  if (!template) {
    return Response.json({ message: "Form template not found" }, { status: 404 });
  }
  return Response.json({ template });
};
const putHandler = async (context) => {
  const { locals, params, request } = context;
  const { id } = params;
  const { DB } = locals.runtime.env;
  if (!id) {
    return Response.json({ message: "Template ID is required" }, { status: 400 });
  }
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.UPDATE, "form_templates");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const body = await request.json();
  const validationResult = validateRequest(FormTemplateSchema.partial(), body);
  if (!validationResult.success) {
    return Response.json({ errors: validationResult.errors }, { status: 400 });
  }
  const formTemplateService = new FormTemplateService(DB);
  try {
    const template = await formTemplateService.update(Number(id), validationResult.data);
    if (!template) {
      return Response.json({ message: "Form template not found" }, { status: 404 });
    }
    return Response.json({
      message: "Form template updated successfully",
      template,
      success: true
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to update form template",
        success: false
      },
      { status: 500 }
    );
  }
};
const deleteHandler = async (context) => {
  const { locals, params } = context;
  const { id } = params;
  const { DB } = locals.runtime.env;
  if (!id) {
    return Response.json({ message: "Template ID is required" }, { status: 400 });
  }
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.DELETE, "form_templates");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const formTemplateService = new FormTemplateService(DB);
  try {
    const success = await formTemplateService.delete(Number(id));
    if (!success) {
      return Response.json({ message: "Form template not found" }, { status: 404 });
    }
    return Response.json({
      message: "Form template deleted successfully",
      success: true
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to delete form template",
        success: false
      },
      { status: 500 }
    );
  }
};
const GET = withPerformanceMonitoring(getHandler, "form-templates:get");
const PUT = withPerformanceMonitoring(putHandler, "form-templates:update");
const DELETE = withPerformanceMonitoring(deleteHandler, "form-templates:delete");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=_id_.astro.mjs.map
