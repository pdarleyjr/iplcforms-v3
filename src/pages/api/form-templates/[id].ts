import { FormTemplateService } from "@/lib/services/form_template";
import { authenticate, authorize } from "@/lib/middleware/rbac-middleware";
import { PERMISSIONS } from "@/lib/utils/rbac";
import { FormTemplateSchema, validateRequest } from "@/lib/schemas/api-validation";
import type { APIRoute } from "astro";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";

const getHandler: APIRoute = async (context) => {
  const { locals, params } = context;
  const { id } = params;
  const { DB } = (locals as any).runtime.env;

  if (!id) {
    return Response.json({ message: "Template ID is required" }, { status: 400 });
  }

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize for read access
  const authzMiddleware = authorize(PERMISSIONS.READ, 'form_templates');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  const formTemplateService = new FormTemplateService(DB);
  const template = await formTemplateService.getById(Number(id));

  if (!template) {
    return Response.json({ message: "Form template not found" }, { status: 404 });
  }

  return Response.json({ template });
};

const putHandler: APIRoute = async (context) => {
  const { locals, params, request } = context;
  const { id } = params;
  const { DB } = (locals as any).runtime.env;

  if (!id) {
    return Response.json({ message: "Template ID is required" }, { status: 400 });
  }

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize for update access
  const authzMiddleware = authorize(PERMISSIONS.UPDATE, 'form_templates');
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;

  // Parse and validate request body
  const body = await request.json();
  const validationResult = validateRequest(FormTemplateSchema.partial(), body);
  if (!validationResult.success) {
    return Response.json({ errors: validationResult.errors }, { status: 400 });
  }

  const formTemplateService = new FormTemplateService(DB);

  try {
    const template = await formTemplateService.update(Number(id), validationResult.data as {
      name?: string;
      description?: string;
      category?: string;
      form_config?: object;
      metadata?: object;
    });
    
    if (!template) {
      return Response.json({ message: "Form template not found" }, { status: 404 });
    }

    return Response.json({
      message: "Form template updated successfully",
      template,
      success: true,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to update form template",
        success: false,
      },
      { status: 500 },
    );
  }
};

const deleteHandler: APIRoute = async (context) => {
  const { locals, params } = context;
  const { id } = params;
  const { DB } = (locals as any).runtime.env;

  if (!id) {
    return Response.json({ message: "Template ID is required" }, { status: 400 });
  }

  // Authenticate request
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;

  // Authorize for delete access
  const authzMiddleware = authorize(PERMISSIONS.DELETE, 'form_templates');
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
      success: true,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to delete form template",
        success: false,
      },
      { status: 500 },
    );
  }
};

export const GET = withPerformanceMonitoring(getHandler, 'form-templates:get');
export const PUT = withPerformanceMonitoring(putHandler, 'form-templates:update');
export const DELETE = withPerformanceMonitoring(deleteHandler, 'form-templates:delete');