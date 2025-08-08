globalThis.process ??= {}; globalThis.process.env ??= {};
import { F as FormTemplateService } from '../../chunks/form_template_whHHz9qG.mjs';
import { v as validateQueryParams, e as FormTemplateFiltersSchema, d as FormTemplateSchema, f as UpdateFormTemplateRequest } from '../../chunks/api-validation_BmEG2mSm.mjs';
import { b as authorize } from '../../chunks/rbac-middleware_C5PL4AHx.mjs';
import { a as RESOURCES, P as PERMISSIONS } from '../../chunks/rbac_vK5lyOl9.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const getHandler = async (context) => {
  const { locals, request } = context;
  const env = locals?.runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({
      error: "Runtime environment not available"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  const authzMiddleware = authorize(PERMISSIONS.READ, RESOURCES.FORM_TEMPLATES);
  const authResult = await authzMiddleware(context);
  if (authResult instanceof Response) {
    return authResult;
  }
  try {
    const url = new URL(request.url);
    const params = validateQueryParams(url, FormTemplateFiltersSchema);
    if (!params.success) {
      return new Response(JSON.stringify({
        error: "Invalid query parameters",
        details: "errors" in params ? params.errors : ["Query parameter validation failed"],
        help: {
          valid_categories: ["assessment", "intake", "treatment", "outcome", "research", "other"],
          valid_target_audiences: ["adult", "pediatric", "geriatric", "adolescent", "all_ages"],
          valid_sort_fields: ["name", "created_at", "updated_at", "usage_count", "completion_time"],
          pagination_limits: "page >= 1, per_page 1-100"
        }
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const filters = params.data;
    if (filters.search && filters.search.length < 3) {
      return new Response(JSON.stringify({
        error: "Search term must be at least 3 characters long"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const formTemplateService = new FormTemplateService(env.DB);
    const templatesResult = await formTemplateService.getTemplateWithTotalCount({
      category: filters.category,
      subcategory: filters.subcategory,
      search: filters.search,
      tags: filters.tags,
      organization: filters.organization,
      target_audience: filters.target_audience,
      max_completion_time: filters.max_completion_time,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
      page: filters.page,
      per_page: filters.per_page
    });
    let facets = void 0;
    if (filters.include_facets) {
      const facetsData = await formTemplateService.getFacets();
      facets = Object.entries(facetsData).map(([name, values]) => ({
        name,
        values: Array.isArray(values) ? values.map((v) => ({
          value: typeof v === "object" ? v.value : v,
          count: typeof v === "object" ? v.count : 1,
          label: typeof v === "object" ? v.value : v
        })) : []
      }));
    }
    const categoryCounts = {};
    const allTags = [];
    let totalCompletionTime = 0;
    let templatesWithCompletionTime = 0;
    templatesResult.templates.forEach((template) => {
      categoryCounts[template.category] = (categoryCounts[template.category] || 0) + 1;
      if (template.tags && Array.isArray(template.tags)) {
        allTags.push(...template.tags);
      }
      if (template.estimated_completion_time) {
        totalCompletionTime += template.estimated_completion_time;
        templatesWithCompletionTime++;
      }
    });
    const tagCounts = {};
    allTags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    const mostUsedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a).slice(0, 10).map(([tag, count]) => ({ tag, count }));
    const aggregations = {
      total_templates: templatesResult.total_count,
      categories: categoryCounts,
      avg_completion_time: templatesWithCompletionTime > 0 ? Math.round(totalCompletionTime / templatesWithCompletionTime) : void 0,
      most_used_tags: mostUsedTags.length > 0 ? mostUsedTags : void 0
    };
    const response = {
      success: true,
      data: {
        templates: templatesResult.templates,
        pagination: {
          page: templatesResult.page,
          per_page: templatesResult.per_page,
          total: templatesResult.total_count,
          pages: templatesResult.total_pages
        },
        ...facets && { facets },
        aggregations
      },
      message: `Found ${templatesResult.templates.length} form templates`
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching form templates:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch form templates",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const postHandler = async (context) => {
  const { locals, request } = context;
  const env = locals?.runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({
      error: "Runtime environment not available"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  const authzMiddleware = authorize(PERMISSIONS.CREATE, RESOURCES.FORM_TEMPLATES);
  const authResult = await authzMiddleware(context);
  if (authResult instanceof Response) {
    return authResult;
  }
  const authenticatedContext = authResult;
  try {
    const body = await request.json();
    const validation = FormTemplateSchema.safeParse(body);
    if (!validation.success) {
      const enhancedErrors = validation.error.issues.map((issue) => {
        const path = issue.path.join(".");
        let enhancedMessage = issue.message;
        if (path.includes("tags")) {
          enhancedMessage = `Tags validation failed: ${issue.message}. Tags must be strings, max 50 characters each, and no more than 20 tags total.`;
        } else if (path.includes("clinical_codes")) {
          enhancedMessage = `Clinical codes validation failed: ${issue.message}. Supported types: icd10, snomed, loinc, custom.`;
        } else if (path.includes("target_audience")) {
          enhancedMessage = `Target audience validation failed: ${issue.message}. Valid values: adult, pediatric, geriatric, adolescent, all_ages.`;
        } else if (path.includes("estimated_completion_time")) {
          enhancedMessage = `Completion time validation failed: ${issue.message}. Must be between 1 and 480 minutes (8 hours).`;
        } else if (path.includes("change_log")) {
          enhancedMessage = `Change log validation failed: ${issue.message}. Each entry requires version, date, changes, and changed_by.`;
        } else if (path.includes("collaborators")) {
          enhancedMessage = `Collaborators validation failed: ${issue.message}. Each collaborator requires user_id, role (editor/reviewer/viewer), added_at, and added_by.`;
        } else if (path.includes("usage_stats")) {
          enhancedMessage = `Usage stats validation failed: ${issue.message}. All numeric fields must be non-negative.`;
        } else if (path.includes("schema.components")) {
          enhancedMessage = `Form schema validation failed: ${issue.message}. Each component requires id, type, label, and order.`;
        } else if (path.includes("title_subtitle")) {
          enhancedMessage = `Title/Subtitle component validation failed: ${issue.message}. Check text content, color format (#RRGGBB), and styling options.`;
        } else if (path.includes("line_separator")) {
          enhancedMessage = `Line separator component validation failed: ${issue.message}. Check thickness (1-10), color format (#RRGGBB), and margins (0-100).`;
        }
        return {
          field: path,
          message: enhancedMessage,
          received: "received" in issue ? issue.received : "unknown"
        };
      });
      return new Response(JSON.stringify({
        error: "Form template validation failed",
        details: enhancedErrors,
        help: {
          required_fields: ["name", "category", "clinical_context", "schema"],
          valid_categories: ["assessment", "intake", "treatment", "outcome", "research", "other"],
          valid_statuses: ["draft", "active", "archived"],
          schema_structure: "schema.components must be an array of form components"
        }
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const formTemplateService = new FormTemplateService(env.DB);
    const validatedData = validation.data;
    const result = await formTemplateService.create({
      name: validatedData.name,
      description: validatedData.description,
      category: validatedData.category,
      subcategory: validatedData.subcategory,
      clinical_context: validatedData.clinical_context,
      form_config: validatedData.schema,
      // Map schema to form_config for backward compatibility
      ui_schema: validatedData.ui_schema,
      scoring_config: validatedData.scoring_config,
      permissions: validatedData.permissions,
      metadata: validatedData.metadata,
      // Enhanced metadata fields
      tags: validatedData.tags,
      clinical_codes: validatedData.clinical_codes,
      target_audience: validatedData.target_audience,
      estimated_completion_time: validatedData.estimated_completion_time,
      change_log: validatedData.change_log,
      collaborators: validatedData.collaborators,
      usage_stats: validatedData.usage_stats,
      status: validatedData.status || "draft",
      created_by: validatedData.created_by || Number(authenticatedContext.locals.customerId),
      updated_by: validatedData.updated_by || Number(authenticatedContext.locals.customerId)
    });
    if (!result.success) {
      return new Response(JSON.stringify({
        error: "Failed to create form template"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data: { templateId: result.templateId },
      message: "Form template created successfully"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error creating form template:", error);
    if (error instanceof Error) {
      if (error.message.includes("UNIQUE constraint failed")) {
        return new Response(JSON.stringify({
          error: "A form template with this name already exists"
        }), {
          status: 409,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (error.message.includes("FOREIGN KEY constraint failed")) {
        return new Response(JSON.stringify({
          error: "Invalid reference to related entity"
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({
      error: "Failed to create form template",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const putHandler = async (context) => {
  const { locals, request } = context;
  const env = locals?.runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({
      error: "Runtime environment not available"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  const authzMiddleware = authorize(PERMISSIONS.UPDATE, RESOURCES.FORM_TEMPLATES);
  const authResult = await authzMiddleware(context);
  if (authResult instanceof Response) {
    return authResult;
  }
  const authenticatedContext = authResult;
  try {
    const url = new URL(request.url);
    const templateId = url.searchParams.get("id");
    if (!templateId) {
      return new Response(JSON.stringify({
        error: "Template ID is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const validation = UpdateFormTemplateRequest.safeParse(body);
    if (!validation.success) {
      const enhancedErrors = validation.error.issues.map((issue) => {
        const path = issue.path.join(".");
        let enhancedMessage = issue.message;
        if (path.includes("tags")) {
          enhancedMessage = `Tags validation failed: ${issue.message}. Tags must be strings, max 50 characters each, and no more than 20 tags total.`;
        } else if (path.includes("clinical_codes")) {
          enhancedMessage = `Clinical codes validation failed: ${issue.message}. Supported types: icd10, snomed, loinc, custom.`;
        } else if (path.includes("target_audience")) {
          enhancedMessage = `Target audience validation failed: ${issue.message}. Valid values: adult, pediatric, geriatric, adolescent, all_ages.`;
        } else if (path.includes("estimated_completion_time")) {
          enhancedMessage = `Completion time validation failed: ${issue.message}. Must be between 1 and 480 minutes (8 hours).`;
        } else if (path.includes("change_log")) {
          enhancedMessage = `Change log validation failed: ${issue.message}. Each entry requires version, date, changes, and changed_by.`;
        } else if (path.includes("collaborators")) {
          enhancedMessage = `Collaborators validation failed: ${issue.message}. Each collaborator requires user_id, role (editor/reviewer/viewer), added_at, and added_by.`;
        } else if (path.includes("usage_stats")) {
          enhancedMessage = `Usage stats validation failed: ${issue.message}. All numeric fields must be non-negative.`;
        } else if (path.includes("schema.components")) {
          enhancedMessage = `Form schema validation failed: ${issue.message}. Each component requires id, type, label, and order.`;
        } else if (path.includes("title_subtitle")) {
          enhancedMessage = `Title/Subtitle component validation failed: ${issue.message}. Check text content, color format (#RRGGBB), and styling options.`;
        } else if (path.includes("line_separator")) {
          enhancedMessage = `Line separator component validation failed: ${issue.message}. Check thickness (1-10), color format (#RRGGBB), and margins (0-100).`;
        }
        return {
          field: path,
          message: enhancedMessage,
          received: "received" in issue ? issue.received : "unknown"
        };
      });
      return new Response(JSON.stringify({
        error: "Form template update validation failed",
        details: enhancedErrors,
        help: {
          updatable_fields: ["name", "description", "category", "subcategory", "tags", "clinical_codes", "target_audience", "estimated_completion_time", "schema", "change_log", "collaborators"],
          valid_categories: ["assessment", "intake", "treatment", "outcome", "research", "other"],
          valid_statuses: ["draft", "active", "archived"],
          note: "Template ID cannot be changed after creation"
        }
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const formTemplateService = new FormTemplateService(env.DB);
    const validatedData = validation.data;
    const updateData = {
      updated_by: Number(authenticatedContext.locals.customerId)
    };
    if (validatedData.name !== void 0) updateData.name = validatedData.name;
    if (validatedData.description !== void 0) updateData.description = validatedData.description;
    if (validatedData.category !== void 0) updateData.category = validatedData.category;
    if (validatedData.subcategory !== void 0) updateData.subcategory = validatedData.subcategory;
    if (validatedData.clinical_context !== void 0) updateData.clinical_context = validatedData.clinical_context;
    if (validatedData.schema !== void 0) updateData.schema = validatedData.schema;
    if (validatedData.ui_schema !== void 0) updateData.ui_schema = validatedData.ui_schema;
    if (validatedData.scoring_config !== void 0) updateData.scoring_config = validatedData.scoring_config;
    if (validatedData.permissions !== void 0) updateData.permissions = validatedData.permissions;
    if (validatedData.metadata !== void 0) updateData.metadata = validatedData.metadata;
    if (validatedData.tags !== void 0) updateData.tags = validatedData.tags;
    if (validatedData.clinical_codes !== void 0) updateData.clinical_codes = validatedData.clinical_codes;
    if (validatedData.target_audience !== void 0) updateData.target_audience = validatedData.target_audience;
    if (validatedData.estimated_completion_time !== void 0) updateData.estimated_completion_time = validatedData.estimated_completion_time;
    if (validatedData.change_log !== void 0) updateData.change_log = validatedData.change_log;
    if (validatedData.collaborators !== void 0) updateData.collaborators = validatedData.collaborators;
    if (validatedData.usage_stats !== void 0) updateData.usage_stats = validatedData.usage_stats;
    if (validatedData.status !== void 0) updateData.status = validatedData.status;
    const result = await formTemplateService.update(Number(templateId), updateData);
    if (!result.success) {
      return new Response(JSON.stringify({
        error: "Form template not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data: { templateId: Number(templateId) },
      message: "Form template updated successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating form template:", error);
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return new Response(JSON.stringify({
        error: "A form template with this name already exists"
      }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      error: "Failed to update form template",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const deleteHandler = async (context) => {
  const { locals, request } = context;
  const env = locals?.runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({
      error: "Runtime environment not available"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  const authzMiddleware = authorize(PERMISSIONS.DELETE, RESOURCES.FORM_TEMPLATES);
  const authResult = await authzMiddleware(context);
  if (authResult instanceof Response) {
    return authResult;
  }
  try {
    const url = new URL(request.url);
    const templateId = url.searchParams.get("id");
    if (!templateId) {
      return new Response(JSON.stringify({
        error: "Template ID is required",
        help: {
          parameter: "Include template ID as query parameter: ?id=123",
          valid_format: "Template ID must be a positive integer"
        }
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const templateIdNum = Number(templateId);
    if (isNaN(templateIdNum) || templateIdNum <= 0) {
      return new Response(JSON.stringify({
        error: "Invalid template ID format",
        details: `Received: "${templateId}", expected: positive integer`,
        help: {
          valid_format: "Template ID must be a positive integer (e.g., 1, 2, 123)",
          parameter: "Include as query parameter: ?id=123"
        }
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const formTemplateService = new FormTemplateService(env.DB);
    const result = await formTemplateService.delete(templateIdNum);
    if (!result) {
      return new Response(JSON.stringify({
        error: "Form template not found",
        help: {
          check: `Template with ID ${templateIdNum} does not exist`,
          suggestion: "Verify the template ID exists before attempting deletion"
        }
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Form template deleted successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error deleting form template:", error);
    if (error instanceof Error) {
      if (error.message.includes("FOREIGN KEY constraint failed")) {
        return new Response(JSON.stringify({
          error: "Cannot delete template: it is being used by existing submissions",
          help: {
            solution: "Archive the template instead of deleting it",
            alternative: "Update all submissions to use a different template first"
          }
        }), {
          status: 409,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (error.message.includes("permission denied") || error.message.includes("unauthorized")) {
        return new Response(JSON.stringify({
          error: "Insufficient permissions to delete this template",
          help: {
            required_permission: "delete:form_templates",
            contact: "Contact your administrator for deletion permissions"
          }
        }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({
      error: "Failed to delete form template",
      details: error instanceof Error ? error.message : "Unknown error",
      help: {
        troubleshoot: "Check template ID format and permissions",
        support: "Contact support if the issue persists"
      }
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = getHandler;
const POST = postHandler;
const PUT = putHandler;
const DELETE = deleteHandler;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=form-templates.astro.mjs.map
