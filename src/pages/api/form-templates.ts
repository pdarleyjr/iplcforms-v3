import type { APIRoute } from 'astro';
import { FormTemplateService } from '../../lib/services/form_template';
import { FormTemplateSchema, validateQueryParams, PaginationSchema } from '../../lib/schemas/api-validation';
import { authenticate, authorize, type AuthenticatedContext } from '../../lib/middleware/rbac-middleware';
import { PERMISSIONS, RESOURCES } from '../../lib/utils/rbac';

const getHandler: APIRoute = async (context) => {
  const { locals, request } = context;
  const env = (locals as any).runtime.env;

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
    const params = validateQueryParams(url, PaginationSchema);

    // Validate search param
    const search = url.searchParams.get('search');
    if (search !== null && search.length < 3) {
      return new Response(JSON.stringify({
        error: 'Search term must be at least 3 characters long'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formTemplateService = new FormTemplateService(env.DB);
    const result = await formTemplateService.getAll({
      page: params.success ? params.data.page : 1,
      per_page: params.success ? params.data.limit : 20,
      search: search || undefined
    });

    return new Response(JSON.stringify(result), {
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
  const env = (locals as any).runtime.env;

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
      return new Response(JSON.stringify({
        error: 'Invalid request data',
        details: validation.error.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formTemplateService = new FormTemplateService(env.DB);

    // Map the validated data to the service format
    const template = await formTemplateService.create({
      name: validation.data.name,
      description: validation.data.description,
      category: validation.data.category,
      form_config: validation.data.schema, // Map schema to form_config
      ...(validation.data.clinical_context && {
        clinical_context: validation.data.clinical_context,
        updated_by: validation.data.updated_by,
      }),
      created_by: validation.data.created_by || Number(authenticatedContext.locals.customerId), // Use authenticated user ID
    });

    return new Response(JSON.stringify(template), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating form template:', error);
    
    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return new Response(JSON.stringify({
        error: 'A form template with this name already exists'
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
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

export const GET = getHandler;
export const POST = postHandler;