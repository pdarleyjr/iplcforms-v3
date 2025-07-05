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

  try {
    const versions = await formTemplateService.getVersions(id);
    return Response.json({ versions });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to get template versions",
      },
      { status: 500 },
    );
  }
}

export async function POST({ locals, params, request }: any) {
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
    const { versionData } = body;

    if (!versionData) {
      return Response.json(
        { message: "Version data is required" },
        { status: 400 },
      );
    }

    const newVersion = await formTemplateService.createVersion(id, versionData);
    
    return Response.json({
      message: "Template version created successfully",
      version: newVersion,
      success: true,
    });
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to create template version",
        success: false,
      },
      { status: 500 },
    );
  }
}