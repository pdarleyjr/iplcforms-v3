import type { APIRoute } from 'astro';
import { FormTemplateService } from '../../lib/services/form_template';
import { 
  FormTemplateSchema, 
  UpdateFormTemplateRequest,
  validateQueryParams, 
  FormTemplateFiltersSchema,
  type GetTemplatesResponse,
  type FormTemplateFilters
} from '../../lib/schemas/api-validation';
import { authenticate, authorize, type AuthenticatedContext } from '../../lib/middleware/rbac-middleware';
import { PERMISSIONS, RESOURCES } from '../../lib/utils/rbac';

const getHandler: APIRoute = async (context) => {
  const { locals, request } = context;
  const env = (locals as any)?.runtime?.env;

  if (!env) {
    return new Response(JSON.stringify({
      error: 'Runtime environment not available'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Use authorize middleware which includes authentication
  const authzMiddleware = authorize(PERMISSIONS.READ, RESOURCES.FORM_TEMPLATES);
  const authResult = await authzMiddleware(context);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  // Now we have authenticated context
  const authenticatedContext = authResult as AuthenticatedContext;

  try {
    const url = new URL(request.url);
    const params = validateQueryParams(url, FormTemplateFiltersSchema);

    if (!params.success) {
      return new Response(JSON.stringify({
        error: 'Invalid query parameters',
        details: 'errors' in params ? params.errors : ['Query parameter validation failed'],
        help: {
          valid_categories: ['assessment', 'intake', 'treatment', 'outcome', 'research', 'other'],
          valid_target_audiences: ['adult', 'pediatric', 'geriatric', 'adolescent', 'all_ages'],
          valid_sort_fields: ['name', 'created_at', 'updated_at', 'usage_count', 'completion_time'],
          pagination_limits: 'page >= 1, per_page 1-100'
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const filters = params.data as FormTemplateFilters;

    // Validate search term length if provided
    if (filters.search && filters.search.length < 3) {
      return new Response(JSON.stringify({
        error: 'Search term must be at least 3 characters long'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formTemplateService = new FormTemplateService(env.DB);
    
    // Get templates with pagination using the correct service method
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

    // Get facets if requested
    let facets = undefined;
    if (filters.include_facets) {
      const facetsData = await formTemplateService.getFacets();
      facets = Object.entries(facetsData).map(([name, values]) => ({
        name,
        values: Array.isArray(values) ? values.map(v => ({
          value: typeof v === 'object' ? v.value : v,
          count: typeof v === 'object' ? v.count : 1,
          label: typeof v === 'object' ? v.value : v
        })) : []
      }));
    }

    // Calculate aggregations from the templates
    const categoryCounts: Record<string, number> = {};
    const allTags: string[] = [];
    let totalCompletionTime = 0;
    let templatesWithCompletionTime = 0;

    templatesResult.templates.forEach(template => {
      categoryCounts[template.category] = (categoryCounts[template.category] || 0) + 1;
      
      // Collect tags for most used calculation
      if (template.tags && Array.isArray(template.tags)) {
        allTags.push(...template.tags);
      }
      
      // Calculate average completion time
      if (template.estimated_completion_time) {
        totalCompletionTime += template.estimated_completion_time;
        templatesWithCompletionTime++;
      }
    });

    // Calculate most used tags
    const tagCounts: Record<string, number> = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    const mostUsedTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    const aggregations = {
      total_templates: templatesResult.total_count,
      categories: categoryCounts,
      avg_completion_time: templatesWithCompletionTime > 0
        ? Math.round(totalCompletionTime / templatesWithCompletionTime)
        : undefined,
      most_used_tags: mostUsedTags.length > 0 ? mostUsedTags : undefined
    };

    // Structure response according to GetTemplatesResponse interface
    const response: GetTemplatesResponse = {
      success: true,
      data: {
        templates: templatesResult.templates,
        pagination: {
          page: templatesResult.page,
          per_page: templatesResult.per_page,
          total: templatesResult.total_count,
          pages: templatesResult.total_pages,
        },
        ...(facets && { facets }),
        aggregations
      },
      message: `Found ${templatesResult.templates.length} form templates`
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching form templates:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch form templates',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

const postHandler: APIRoute = async (context) => {
  const { locals, request } = context;
  const env = (locals as any)?.runtime?.env;

  if (!env) {
    return new Response(JSON.stringify({
      error: 'Runtime environment not available'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Use authorize middleware which includes authentication
  const authzMiddleware = authorize(PERMISSIONS.CREATE, RESOURCES.FORM_TEMPLATES);
  const authResult = await authzMiddleware(context);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  // Now we have authenticated context
  const authenticatedContext = authResult as AuthenticatedContext;

  try {
    const body = await request.json();
    const validation = FormTemplateSchema.safeParse(body);

    if (!validation.success) {
      // Provide enhanced error messages for specific validation scenarios
      const enhancedErrors = validation.error.issues.map(issue => {
        const path = issue.path.join('.');
        let enhancedMessage = issue.message;
        
        // Enhanced error messages for new fields
        if (path.includes('tags')) {
          enhancedMessage = `Tags validation failed: ${issue.message}. Tags must be strings, max 50 characters each, and no more than 20 tags total.`;
        } else if (path.includes('clinical_codes')) {
          enhancedMessage = `Clinical codes validation failed: ${issue.message}. Supported types: icd10, snomed, loinc, custom.`;
        } else if (path.includes('target_audience')) {
          enhancedMessage = `Target audience validation failed: ${issue.message}. Valid values: adult, pediatric, geriatric, adolescent, all_ages.`;
        } else if (path.includes('estimated_completion_time')) {
          enhancedMessage = `Completion time validation failed: ${issue.message}. Must be between 1 and 480 minutes (8 hours).`;
        } else if (path.includes('change_log')) {
          enhancedMessage = `Change log validation failed: ${issue.message}. Each entry requires version, date, changes, and changed_by.`;
        } else if (path.includes('collaborators')) {
          enhancedMessage = `Collaborators validation failed: ${issue.message}. Each collaborator requires user_id, role (editor/reviewer/viewer), added_at, and added_by.`;
        } else if (path.includes('usage_stats')) {
          enhancedMessage = `Usage stats validation failed: ${issue.message}. All numeric fields must be non-negative.`;
        } else if (path.includes('schema.components')) {
          enhancedMessage = `Form schema validation failed: ${issue.message}. Each component requires id, type, label, and order.`;
        } else if (path.includes('title_subtitle')) {
          enhancedMessage = `Title/Subtitle component validation failed: ${issue.message}. Check text content, color format (#RRGGBB), and styling options.`;
        } else if (path.includes('line_separator')) {
          enhancedMessage = `Line separator component validation failed: ${issue.message}. Check thickness (1-10), color format (#RRGGBB), and margins (0-100).`;
        }
        
        return {
          field: path,
          message: enhancedMessage,
          received: 'received' in issue ? issue.received : 'unknown'
        };
      });

      return new Response(JSON.stringify({
        error: 'Form template validation failed',
        details: enhancedErrors,
        help: {
          required_fields: ['name', 'category', 'clinical_context', 'schema'],
          valid_categories: ['assessment', 'intake', 'treatment', 'outcome', 'research', 'other'],
          valid_statuses: ['draft', 'active', 'archived'],
          schema_structure: 'schema.components must be an array of form components'
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formTemplateService = new FormTemplateService(env.DB);
    const validatedData = validation.data;

    // Create template with enhanced metadata support
    const result = await formTemplateService.create({
      name: validatedData.name,
      description: validatedData.description,
      category: validatedData.category,
      subcategory: validatedData.subcategory,
      clinical_context: validatedData.clinical_context,
      form_config: validatedData.schema, // Map schema to form_config for backward compatibility
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
      status: validatedData.status || 'draft',
      created_by: validatedData.created_by || Number(authenticatedContext.locals.customerId),
      updated_by: validatedData.updated_by || Number(authenticatedContext.locals.customerId),
    });

    if (!result.success) {
      return new Response(JSON.stringify({
        error: 'Failed to create form template'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: { templateId: result.templateId },
      message: 'Form template created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating form template:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return new Response(JSON.stringify({
          error: 'A form template with this name already exists'
        }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        return new Response(JSON.stringify({
          error: 'Invalid reference to related entity'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({
      error: 'Failed to create form template',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT handler for updating templates
const putHandler: APIRoute = async (context) => {
  const { locals, request } = context;
  const env = (locals as any)?.runtime?.env;

  if (!env) {
    return new Response(JSON.stringify({
      error: 'Runtime environment not available'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Use authorize middleware which includes authentication
  const authzMiddleware = authorize(PERMISSIONS.UPDATE, RESOURCES.FORM_TEMPLATES);
  const authResult = await authzMiddleware(context);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  const authenticatedContext = authResult as AuthenticatedContext;

  try {
    const url = new URL(request.url);
    const templateId = url.searchParams.get('id');

    if (!templateId) {
      return new Response(JSON.stringify({
        error: 'Template ID is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const validation = UpdateFormTemplateRequest.safeParse(body);

    if (!validation.success) {
      // Provide enhanced error messages for specific validation scenarios
      const enhancedErrors = validation.error.issues.map(issue => {
        const path = issue.path.join('.');
        let enhancedMessage = issue.message;
        
        // Enhanced error messages for new fields
        if (path.includes('tags')) {
          enhancedMessage = `Tags validation failed: ${issue.message}. Tags must be strings, max 50 characters each, and no more than 20 tags total.`;
        } else if (path.includes('clinical_codes')) {
          enhancedMessage = `Clinical codes validation failed: ${issue.message}. Supported types: icd10, snomed, loinc, custom.`;
        } else if (path.includes('target_audience')) {
          enhancedMessage = `Target audience validation failed: ${issue.message}. Valid values: adult, pediatric, geriatric, adolescent, all_ages.`;
        } else if (path.includes('estimated_completion_time')) {
          enhancedMessage = `Completion time validation failed: ${issue.message}. Must be between 1 and 480 minutes (8 hours).`;
        } else if (path.includes('change_log')) {
          enhancedMessage = `Change log validation failed: ${issue.message}. Each entry requires version, date, changes, and changed_by.`;
        } else if (path.includes('collaborators')) {
          enhancedMessage = `Collaborators validation failed: ${issue.message}. Each collaborator requires user_id, role (editor/reviewer/viewer), added_at, and added_by.`;
        } else if (path.includes('usage_stats')) {
          enhancedMessage = `Usage stats validation failed: ${issue.message}. All numeric fields must be non-negative.`;
        } else if (path.includes('schema.components')) {
          enhancedMessage = `Form schema validation failed: ${issue.message}. Each component requires id, type, label, and order.`;
        } else if (path.includes('title_subtitle')) {
          enhancedMessage = `Title/Subtitle component validation failed: ${issue.message}. Check text content, color format (#RRGGBB), and styling options.`;
        } else if (path.includes('line_separator')) {
          enhancedMessage = `Line separator component validation failed: ${issue.message}. Check thickness (1-10), color format (#RRGGBB), and margins (0-100).`;
        }
        
        return {
          field: path,
          message: enhancedMessage,
          received: 'received' in issue ? issue.received : 'unknown'
        };
      });

      return new Response(JSON.stringify({
        error: 'Form template update validation failed',
        details: enhancedErrors,
        help: {
          updatable_fields: ['name', 'description', 'category', 'subcategory', 'tags', 'clinical_codes', 'target_audience', 'estimated_completion_time', 'schema', 'change_log', 'collaborators'],
          valid_categories: ['assessment', 'intake', 'treatment', 'outcome', 'research', 'other'],
          valid_statuses: ['draft', 'active', 'archived'],
          note: 'Template ID cannot be changed after creation'
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formTemplateService = new FormTemplateService(env.DB);
    const validatedData = validation.data;

    // Prepare update data with enhanced metadata - service expects objects, not strings
    const updateData: any = {
      updated_by: Number(authenticatedContext.locals.customerId),
    };

    // Only include fields that are provided
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.subcategory !== undefined) updateData.subcategory = validatedData.subcategory;
    if (validatedData.clinical_context !== undefined) updateData.clinical_context = validatedData.clinical_context;
    if (validatedData.schema !== undefined) updateData.schema = validatedData.schema;
    if (validatedData.ui_schema !== undefined) updateData.ui_schema = validatedData.ui_schema;
    if (validatedData.scoring_config !== undefined) updateData.scoring_config = validatedData.scoring_config;
    if (validatedData.permissions !== undefined) updateData.permissions = validatedData.permissions;
    if (validatedData.metadata !== undefined) updateData.metadata = validatedData.metadata;
    if (validatedData.tags !== undefined) updateData.tags = validatedData.tags;
    if (validatedData.clinical_codes !== undefined) updateData.clinical_codes = validatedData.clinical_codes;
    if (validatedData.target_audience !== undefined) updateData.target_audience = validatedData.target_audience;
    if (validatedData.estimated_completion_time !== undefined) updateData.estimated_completion_time = validatedData.estimated_completion_time;
    if (validatedData.change_log !== undefined) updateData.change_log = validatedData.change_log;
    if (validatedData.collaborators !== undefined) updateData.collaborators = validatedData.collaborators;
    if (validatedData.usage_stats !== undefined) updateData.usage_stats = validatedData.usage_stats;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;

    const result = await formTemplateService.update(Number(templateId), updateData);

    if (!result.success) {
      return new Response(JSON.stringify({
        error: 'Form template not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: { templateId: Number(templateId) },
      message: 'Form template updated successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating form template:', error);
    
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({
        error: 'A form template with this name already exists'
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: 'Failed to update form template',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE handler for removing templates
const deleteHandler: APIRoute = async (context) => {
  const { locals, request } = context;
  const env = (locals as any)?.runtime?.env;

  if (!env) {
    return new Response(JSON.stringify({
      error: 'Runtime environment not available'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Use authorize middleware which includes authentication
  const authzMiddleware = authorize(PERMISSIONS.DELETE, RESOURCES.FORM_TEMPLATES);
  const authResult = await authzMiddleware(context);
  
  if (authResult instanceof Response) {
    return authResult;
  }

  try {
    const url = new URL(request.url);
    const templateId = url.searchParams.get('id');

    if (!templateId) {
      return new Response(JSON.stringify({
        error: 'Template ID is required',
        help: {
          parameter: 'Include template ID as query parameter: ?id=123',
          valid_format: 'Template ID must be a positive integer'
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate template ID format
    const templateIdNum = Number(templateId);
    if (isNaN(templateIdNum) || templateIdNum <= 0) {
      return new Response(JSON.stringify({
        error: 'Invalid template ID format',
        details: `Received: "${templateId}", expected: positive integer`,
        help: {
          valid_format: 'Template ID must be a positive integer (e.g., 1, 2, 123)',
          parameter: 'Include as query parameter: ?id=123'
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formTemplateService = new FormTemplateService(env.DB);
    const result = await formTemplateService.delete(templateIdNum);

    if (!result) {
      return new Response(JSON.stringify({
        error: 'Form template not found',
        help: {
          check: `Template with ID ${templateIdNum} does not exist`,
          suggestion: 'Verify the template ID exists before attempting deletion'
        }
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Form template deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting form template:', error);
    
    // Enhanced error handling for deletion
    if (error instanceof Error) {
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        return new Response(JSON.stringify({
          error: 'Cannot delete template: it is being used by existing submissions',
          help: {
            solution: 'Archive the template instead of deleting it',
            alternative: 'Update all submissions to use a different template first'
          }
        }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (error.message.includes('permission denied') || error.message.includes('unauthorized')) {
        return new Response(JSON.stringify({
          error: 'Insufficient permissions to delete this template',
          help: {
            required_permission: 'delete:form_templates',
            contact: 'Contact your administrator for deletion permissions'
          }
        }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({
      error: 'Failed to delete form template',
      details: error instanceof Error ? error.message : 'Unknown error',
      help: {
        troubleshoot: 'Check template ID format and permissions',
        support: 'Contact support if the issue persists'
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET = getHandler;
export const POST = postHandler;
export const PUT = putHandler;
export const DELETE = deleteHandler;