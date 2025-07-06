import { FormTemplateService } from "@/lib/services/form_template";
import { authenticate, authorize } from "@/lib/auth/rbac-middleware";
import { withPerformanceMonitoring } from '@/lib/utils/performance-wrapper';
import type { APIContext } from 'astro';
import type { AuthenticatedContext } from '@/lib/auth/rbac-middleware';

const getHandler = async (context: APIContext) => {
  // Apply authentication middleware
  const authResponse = await authenticate(context);
  if (authResponse) return authResponse;

  // Apply authorization middleware - READ permission on form_templates
  const authzResponse = await authorize({
    resource: 'form_templates',
    action: 'read'
  })(context);
  if (authzResponse) return authzResponse;

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

  const { DB } = (context.locals as any).runtime.env;

  const formTemplateService = new FormTemplateService(DB);

  try {
    const versions = await formTemplateService.getVersions(templateId);
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

const postHandler = async (context: APIContext) => {
  // Apply authentication middleware
  const authResponse = await authenticate(context);
  if (authResponse) return authResponse;

  // Apply authorization middleware - CREATE permission on form_templates
  const authzResponse = await authorize({
    resource: 'form_templates',
    action: 'create'
  })(context);
  if (authzResponse) return authzResponse;

  const { id } = context.params;
  
  if (!id) {
    return Response.json(
      { message: "Template ID is required" },
      { status: 400 }
    );
  }

  const { DB } = (context.locals as any).runtime.env;

  const formTemplateService = new FormTemplateService(DB);

  try {
    const body = await context.request.json() as { versionData?: any };
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