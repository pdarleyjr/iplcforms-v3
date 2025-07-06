import { FormTemplateService } from "@/lib/services/form_template";
import { validateApiTokenResponse } from "@/lib/api";
import { CreateFormTemplateRequest, validateRequest, ApiResponseSchema, PaginationSchema, FilterSchema, validateQueryParams } from "@/lib/schemas/api-validation";
import type { APIRoute } from "astro";
import { withPerformanceMonitoring } from "@/lib/utils/performance-wrapper";

const getHandler: APIRoute = async ({ locals, request }) => {
  const { API_TOKEN, DB } = locals.runtime.env;

  // Validate API token
  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  try {
    // Validate query parameters for pagination and filtering
    const url = new URL(request.url);
    const paginationValidation = validateQueryParams(url, PaginationSchema);
    const filterValidation = validateQueryParams(url, FilterSchema);

    if (!paginationValidation.success || !filterValidation.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid query parameters",
          errors: [
            ...(paginationValidation.success ? [] : paginationValidation.errors),
            ...(filterValidation.success ? [] : filterValidation.errors),
          ],
        },
        { status: 400 }
      );
    }

    const formTemplateService = new FormTemplateService(DB);
    const templates = await formTemplateService.getAll();

    return Response.json({
      success: true,
      message: "Form templates retrieved successfully",
      data: { templates },
    });
  } catch (error) {
    console.error("Error fetching form templates:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to load form templates",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      },
      { status: 500 },
    );
  }
};

const postHandler: APIRoute = async ({ locals, request }) => {
  const { API_TOKEN, DB } = locals.runtime.env;

  // Validate API token
  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  try {
    // Parse and validate request body with Zod
    const body = await request.json();
    const validation = validateRequest(CreateFormTemplateRequest, body);
    
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const formTemplateService = new FormTemplateService(DB);
    
    // Transform Zod validated data to match service interface
    const serviceData = {
      name: validation.data.name,
      description: validation.data.description,
      category: validation.data.category,
      form_config: validation.data.schema, // Map schema to form_config
      metadata: {
        clinical_context: validation.data.clinical_context,
        updated_by: validation.data.updated_by,
      },
      created_by: validation.data.created_by || 1, // Default to user ID 1 if not provided
    };

    const template = await formTemplateService.create(serviceData);

    return Response.json(
      {
        success: true,
        message: "Form template created successfully",
        data: { template },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating form template:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to create form template",
        errors: [error instanceof Error ? error.message : "Unknown error"],
      },
      { status: 500 },
    );
  }
};

export const GET = withPerformanceMonitoring(getHandler, 'form-templates:list');
export const POST = withPerformanceMonitoring(postHandler, 'form-templates:create');