globalThis.process ??= {}; globalThis.process.env ??= {};
import { F as FormTemplateService } from '../../../../chunks/form_template_whHHz9qG.mjs';
import { a as authenticate, b as authorize } from '../../../../chunks/rbac-middleware_CqpNIYMv.mjs';
import { w as withPerformanceMonitoring } from '../../../../chunks/performance-wrapper_COlTcJLx.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const getHandler = async (context) => {
  const authResult = await authenticate(context);
  if (authResult instanceof Response) {
    return authResult;
  }
  const authzMiddleware = authorize("read", "form_templates");
  const authzResult = await authzMiddleware(context);
  if (authzResult instanceof Response) {
    return authzResult;
  }
  const { id } = context.params;
  if (!id) {
    return Response.json(
      { message: "Template ID is required" },
      { status: 400 }
    );
  }
  const templateId = Number(id);
  if (isNaN(templateId)) {
    return Response.json(
      { message: "Invalid template ID format" },
      { status: 400 }
    );
  }
  const { DB } = context.locals.runtime.env;
  const formTemplateService = new FormTemplateService(DB);
  try {
    const versions = await formTemplateService.getVersions(templateId);
    return Response.json({ versions });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to get template versions"
      },
      { status: 500 }
    );
  }
};
const postHandler = async (context) => {
  const authResult = await authenticate(context);
  if (authResult instanceof Response) {
    return authResult;
  }
  const authzMiddleware = authorize("create", "form_templates");
  const authzResult = await authzMiddleware(context);
  if (authzResult instanceof Response) {
    return authzResult;
  }
  const { id } = context.params;
  if (!id) {
    return Response.json(
      { message: "Template ID is required" },
      { status: 400 }
    );
  }
  const { DB } = context.locals.runtime.env;
  const formTemplateService = new FormTemplateService(DB);
  try {
    const body = await context.request.json();
    const { versionData } = body;
    if (!versionData) {
      return Response.json(
        { message: "Version data is required" },
        { status: 400 }
      );
    }
    const newVersion = await formTemplateService.create({
      ...versionData,
      parent_template_id: Number(id),
      created_by: versionData.created_by || 1
      // Default to system user if not provided
    });
    return Response.json({
      message: "Template version created successfully",
      version: newVersion,
      success: true
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to create template version",
        success: false
      },
      { status: 500 }
    );
  }
};
const GET = withPerformanceMonitoring(getHandler, "form-template-versions:list");
const POST = withPerformanceMonitoring(postHandler, "form-template-versions:create");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=versions.astro.mjs.map
