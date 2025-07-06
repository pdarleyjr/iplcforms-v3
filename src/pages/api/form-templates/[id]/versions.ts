import { FormTemplateService } from "@/lib/services/form_template";
import { validateApiTokenResponse } from "@/lib/api";
import { withPerformanceMonitoring } from '@/lib/utils/performance-wrapper';

const getHandler = async ({ locals, params, request }: any) => {
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
};

const postHandler = async ({ locals, params, request }: any) => {
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

    // Create a new version by creating a new template with parent_template_id
    const newVersion = await formTemplateService.create({
      ...versionData,
      parent_template_id: Number(id),
      created_by: versionData.created_by || 1 // Default to system user if not provided
    });
    
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
};

export const GET = withPerformanceMonitoring(getHandler, 'form-template-versions:list');
export const POST = withPerformanceMonitoring(postHandler, 'form-template-versions:create');