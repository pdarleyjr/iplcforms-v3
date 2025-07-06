import { FormTemplateService } from "@/lib/services/form_template";
import { validateApiTokenResponse } from "@/lib/api";
import type { APIRoute } from "astro";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";

const getHandler: APIRoute = async ({ locals, params, request }) => {
  const { id } = params;
  const { API_TOKEN, DB } = locals.runtime.env;

  if (!id) {
    return Response.json({ message: "Template ID is required" }, { status: 400 });
  }

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const formTemplateService = new FormTemplateService(DB);
  const template = await formTemplateService.getById(Number(id));

  if (!template) {
    return Response.json({ message: "Form template not found" }, { status: 404 });
  }

  return Response.json({ template });
};

const putHandler: APIRoute = async ({ locals, params, request }) => {
  const { id } = params;
  const { API_TOKEN, DB } = locals.runtime.env;

  if (!id) {
    return Response.json({ message: "Template ID is required" }, { status: 400 });
  }

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const formTemplateService = new FormTemplateService(DB);

  try {
    const body = await request.json() as {
      name?: string;
      description?: string;
      category?: string;
      form_config?: object;
      metadata?: object;
    };
    const template = await formTemplateService.update(Number(id), body);
    
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

const deleteHandler: APIRoute = async ({ locals, params, request }) => {
  const { id } = params;
  const { API_TOKEN, DB } = locals.runtime.env;

  if (!id) {
    return Response.json({ message: "Template ID is required" }, { status: 400 });
  }

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

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