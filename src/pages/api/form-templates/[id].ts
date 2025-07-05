import { FormTemplateService } from "@/lib/services/form_template";
import { validateApiTokenResponse } from "@/lib/api";

export async function GET({ locals, params, request }: any) {
  const { id } = params;
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const formTemplateService = new FormTemplateService(DB);
  const template = await formTemplateService.getById(id);

  if (!template) {
    return Response.json({ message: "Form template not found" }, { status: 404 });
  }

  return Response.json({ template });
}

export async function PUT({ locals, params, request }: any) {
  const { id } = params;
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const formTemplateService = new FormTemplateService(DB);

  try {
    const body = await request.json();
    const template = await formTemplateService.update(id, body);
    
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
}

export async function DELETE({ locals, params, request }: any) {
  const { id } = params;
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const formTemplateService = new FormTemplateService(DB);

  try {
    const success = await formTemplateService.delete(id);
    
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
}