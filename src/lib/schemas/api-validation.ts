// Comprehensive Zod Validation Schemas for IPLC Forms v3 API
// Implementing robust validation across all endpoints

import { z } from "zod";

// Core Entity Schemas
export const CustomerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  notes: z.string().max(1000).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const SubscriptionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive("Price must be positive"),
  features: z.array(z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(300).optional(),
  })).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const CustomerSubscriptionSchema = z.object({
  id: z.number().optional(),
  customer_id: z.number().positive("Customer ID must be positive"),
  subscription_id: z.number().positive("Subscription ID must be positive"),
  status: z.enum(["active", "inactive", "cancelled", "paused"]),
  subscription_starts_at: z.string().datetime().optional(),
  subscription_ends_at: z.union([z.string().datetime(), z.number()]).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Form Builder Schemas
export const FormComponentSchema = z.object({
  id: z.string().min(1),
  type: z.enum([
    'text_input', 'textarea', 'select', 'radio', 'checkbox', 'date', 'number', 'scale',
    'clinical_scale', 'assistance_level', 'demographics', 'standardized_test', 'oral_motor',
    'language_sample', 'sensory_processing', 'goals_planning', 'clinical_signature', 'cpt_code',
    'ai_summary', 'title_subtitle', 'subtitle', 'line_separator', 'evaluation_section', 'clinical_component'
  ]),
  label: z.string().min(1, "Label is required").max(200),
  order: z.number().min(0),
  sectionId: z.string().optional(), // For evaluation_section components
  collapsed: z.boolean().optional(), // For evaluation_section components
  props: z.object({
    required: z.boolean().optional(),
    placeholder: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    options: z.array(z.string().max(100)).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    validation: z.object({
      minLength: z.number().min(0).optional(),
      maxLength: z.number().min(1).optional(),
      pattern: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    visibilityCondition: z.object({
      field: z.string().min(1),
      value: z.any(),
      operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
    }).optional(),
    // AI Summary specific props
    ai_summary: z.object({
      auto_select_fields: z.boolean().optional(),
      default_prompt: z.string().max(1000).optional(),
      max_length: z.number().min(50).max(2000).optional(),
      include_medical_context: z.boolean().optional(),
    }).optional(),
    // Title/Subtitle specific props
    title_subtitle: z.object({
      text: z.string().max(500),
      level: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).default('h2'),
      fontFamily: z.enum(['system', 'serif', 'sans-serif', 'monospace']).default('system'),
      fontSize: z.enum(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']).default('base'),
      fontWeight: z.enum(['normal', 'medium', 'semibold', 'bold']).default('normal'),
      color: z.string().regex(/^#[0-9A-F]{6}$/i).default('#000000'),
      alignment: z.enum(['left', 'center', 'right']).default('left'),
      marginTop: z.number().min(0).max(100).default(0),
      marginBottom: z.number().min(0).max(100).default(0),
      enableMarkdown: z.boolean().default(false),
    }).optional(),
    // Line Separator specific props
    line_separator: z.object({
      thickness: z.number().min(1).max(10).default(1),
      color: z.string().regex(/^#[0-9A-F]{6}$/i).default('#CCCCCC'),
      style: z.enum(['solid', 'dashed', 'dotted']).default('solid'),
      width: z.number().min(10).max(100).default(100),
      alignment: z.enum(['left', 'center', 'right']).default('center'),
      marginTop: z.number().min(0).max(100).default(10),
      marginBottom: z.number().min(0).max(100).default(10),
    }).optional(),
  }).optional(),
});

export const FormPageSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  order: z.number().min(0),
  components: z.array(FormComponentSchema),
});

export const FormTemplateSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(['assessment', 'intake', 'treatment', 'outcome', 'research', 'other']),
  subcategory: z.string().max(100).optional(),
  clinical_context: z.string().min(2, "Clinical context is required").max(1000),
  version: z.number().min(1).default(1),
  schema: z.object({
    // Support both single-page (components) and multi-page (pages) forms
    components: z.array(FormComponentSchema).optional(),
    pages: z.array(FormPageSchema).optional(),
    isMultiPage: z.boolean().optional().default(false),
  }).refine(
    (data) => {
      // Either components or pages must be present
      return (data.components && data.components.length > 0) ||
             (data.pages && data.pages.length > 0);
    },
    {
      message: "Form must have either components or pages",
    }
  ),
  ui_schema: z.record(z.string(), z.any()).optional(),
  scoring_config: z.record(z.string(), z.any()).optional(),
  permissions: z.record(z.string(), z.any()).optional(),
  metadata: z.object({
    showIplcLogo: z.boolean().optional(),
  }).catchall(z.any()).optional(),
  // Enhanced metadata fields
  tags: z.array(z.string().max(50)).max(20).optional(),
  clinical_codes: z.object({
    icd10: z.array(z.string()).optional(),
    snomed: z.array(z.string()).optional(),
    loinc: z.array(z.string()).optional(),
    custom: z.record(z.string(), z.array(z.string())).optional(),
  }).optional(),
  target_audience: z.array(z.enum(['adult', 'pediatric', 'geriatric', 'adolescent', 'all_ages'])).optional(),
  estimated_completion_time: z.number().min(1).max(480).optional(), // 1 minute to 8 hours
  change_log: z.array(z.object({
    version: z.number().min(1),
    date: z.string().datetime(),
    changes: z.string().max(1000),
    changed_by: z.number().positive(),
  })).optional(),
  collaborators: z.array(z.object({
    user_id: z.number().positive(),
    role: z.enum(['editor', 'reviewer', 'viewer']),
    added_at: z.string().datetime(),
    added_by: z.number().positive(),
  })).optional(),
  usage_stats: z.object({
    total_submissions: z.number().min(0).default(0),
    unique_users: z.number().min(0).default(0),
    last_used: z.string().datetime().optional(),
    avg_completion_time: z.number().min(0).optional(),
    completion_rate: z.number().min(0).max(100).optional(),
  }).optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  created_by: z.number().positive().optional(),
  updated_by: z.number().positive().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const FormSubmissionSchema = z.object({
  id: z.number().optional(),
  template_id: z.number().positive("Template ID is required"),
  user_id: z.string().optional(),
  form_data: z.record(z.string(), z.any()),
  calculated_score: z.number().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  status: z.enum(['draft', 'submitted', 'reviewed', 'approved', 'deleted']).default('draft'),
  submission_date: z.string().datetime().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Template Collection Schemas
export const FormTemplateCollectionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Collection name must be at least 2 characters").max(200),
  description: z.string().max(1000).optional(),
  organization_id: z.number().positive().optional(),
  is_public: z.boolean().default(false),
  metadata: z.record(z.string(), z.any()).optional(),
  created_by: z.number().positive().optional(),
  updated_by: z.number().positive().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const FormTemplateCollectionItemSchema = z.object({
  id: z.number().optional(),
  collection_id: z.number().positive("Collection ID is required"),
  template_id: z.number().positive("Template ID is required"),
  order_index: z.number().min(0).default(0),
  added_by: z.number().positive().optional(),
  added_at: z.string().optional(),
});

// Clinical RBAC Schemas
export const RoleSchema = z.object({
  id: z.number().optional(),
  name: z.enum(['patient', 'clinician', 'admin', 'researcher', 'supervisor']),
  description: z.string().max(500).optional(),
  permissions: z.array(z.string()),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const UserPermissionSchema = z.object({
  user_id: z.string().min(1),
  role: z.enum(['patient', 'clinician', 'admin', 'researcher', 'supervisor']),
  resource_type: z.enum(['form_template', 'form_submission', 'customer', 'subscription', 'analytics']),
  resource_id: z.number().optional(),
  permissions: z.array(z.enum(['read', 'write', 'delete', 'admin', 'clinical_review'])),
});

// Workflow Schemas
export const WorkflowEventSchema = z.object({
  type: z.string().min(1),
  data: z.record(z.string(), z.any()),
  timestamp: z.string().datetime().optional(),
});

export const CustomerWorkflowSchema = z.object({
  customer_id: z.number().positive("Customer ID is required"),
  workflow_type: z.enum(['onboarding', 'assessment', 'treatment', 'follow_up']).default('onboarding'),
  parameters: z.record(z.string(), z.any()).optional(),
});

// API Request/Response Schemas
export const CreateCustomerRequest = CustomerSchema.omit({ id: true, created_at: true, updated_at: true });
export const UpdateCustomerRequest = CustomerSchema.partial().omit({ id: true, created_at: true, updated_at: true });

export const CreateSubscriptionRequest = SubscriptionSchema.omit({ id: true, created_at: true, updated_at: true });
export const UpdateSubscriptionRequest = SubscriptionSchema.partial().omit({ id: true, created_at: true, updated_at: true });

export const CreateCustomerSubscriptionRequest = CustomerSubscriptionSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const CreateFormTemplateRequest = FormTemplateSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});
export const UpdateFormTemplateRequest = FormTemplateSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true
});

// Collection Request Schemas
export const CreateCollectionRequest = FormTemplateCollectionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});
export const UpdateCollectionRequest = FormTemplateCollectionSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const AddTemplateToCollectionRequest = FormTemplateCollectionItemSchema.omit({
  id: true,
  added_at: true
});

export const CreateFormSubmissionRequest = FormSubmissionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  submission_date: true
});

export const UpdateFormSubmissionRequest = FormSubmissionSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Form Submission Query Filters
export const FormSubmissionFiltersSchema = z.object({
  template_id: z.coerce.number().positive().optional(),
  patient_id: z.coerce.number().positive().optional(),
  status: z.enum(['draft', 'submitted', 'reviewed', 'approved', 'deleted']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  per_page: z.coerce.number().min(1).max(100).default(10).optional(),
});

// Customer Workflow Request Schemas
export const CreateCustomerWorkflowRequest = CustomerWorkflowSchema;
export const UpdateCustomerWorkflowRequest = CustomerWorkflowSchema.partial();

// Query Parameter Schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const FilterSchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  user_id: z.string().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
});

// Enhanced Form Template Query Filters
export const FormTemplateFiltersSchema = z.object({
  search: z.string().max(200).optional(),
  category: z.enum(['assessment', 'intake', 'treatment', 'outcome', 'research', 'other']).optional(),
  subcategory: z.string().max(100).optional(),
  tags: z.array(z.string().max(50)).optional(),
  organization: z.coerce.number().positive().optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  target_audience: z.enum(['adult', 'pediatric', 'geriatric', 'adolescent', 'all_ages']).optional(),
  clinical_codes: z.object({
    icd10: z.array(z.string()).optional(),
    snomed: z.array(z.string()).optional(),
    loinc: z.array(z.string()).optional(),
  }).optional(),
  created_by: z.coerce.number().positive().optional(),
  updated_since: z.string().datetime().optional(),
  min_completion_time: z.coerce.number().min(1).optional(),
  max_completion_time: z.coerce.number().min(1).optional(),
  has_collaborators: z.coerce.boolean().optional(),
  collection_id: z.coerce.number().positive().optional(),
  sort_by: z.enum(['name', 'created_at', 'updated_at', 'usage_count', 'completion_time']).default('updated_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(100).default(20),
  include_facets: z.coerce.boolean().default(false),
});

export const AnalyticsQuerySchema = z.object({
  template_id: z.coerce.number().positive().optional(),
  date_range: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  clinical_insights: z.coerce.boolean().default(false),
  include_demographics: z.coerce.boolean().default(false),
  group_by: z.enum(['day', 'week', 'month']).default('day'),
});

// Response Schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  errors: z.array(z.string()).optional(),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    pages: z.number(),
  }).optional(),
});

// Enhanced Template Response Schemas
export const FacetSchema = z.object({
  name: z.string(),
  values: z.array(z.object({
    value: z.string(),
    count: z.number(),
    label: z.string().optional(),
  })),
});

export const GetTemplatesResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    templates: z.array(FormTemplateSchema),
    pagination: z.object({
      page: z.number(),
      per_page: z.number(),
      total: z.number(),
      pages: z.number(),
    }),
    facets: z.array(FacetSchema).optional(),
    aggregations: z.object({
      total_templates: z.number(),
      categories: z.record(z.string(), z.number()),
      avg_completion_time: z.number().optional(),
      most_used_tags: z.array(z.object({
        tag: z.string(),
        count: z.number(),
      })).optional(),
    }).optional(),
  }),
  message: z.string().optional(),
});

export const GetTemplateResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    template: FormTemplateSchema,
    related_templates: z.array(FormTemplateSchema.pick({
      id: true,
      name: true,
      category: true,
      description: true,
    })).optional(),
    usage_analytics: z.object({
      recent_submissions: z.number(),
      performance_metrics: z.record(z.string(), z.any()),
    }).optional(),
  }),
  message: z.string().optional(),
});

// Type exports for use throughout the application
export type Customer = z.infer<typeof CustomerSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type CustomerSubscription = z.infer<typeof CustomerSubscriptionSchema>;
export type FormComponent = z.infer<typeof FormComponentSchema>;
export type FormPage = z.infer<typeof FormPageSchema>;
export type FormTemplate = z.infer<typeof FormTemplateSchema>;
export type FormSubmission = z.infer<typeof FormSubmissionSchema>;
export type FormTemplateCollection = z.infer<typeof FormTemplateCollectionSchema>;
export type FormTemplateCollectionItem = z.infer<typeof FormTemplateCollectionItemSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type UserPermission = z.infer<typeof UserPermissionSchema>;
export type WorkflowEvent = z.infer<typeof WorkflowEventSchema>;
export type CustomerWorkflow = z.infer<typeof CustomerWorkflowSchema>;

export type CreateCustomerRequest = z.infer<typeof CreateCustomerRequest>;
export type UpdateCustomerRequest = z.infer<typeof UpdateCustomerRequest>;
export type CreateSubscriptionRequest = z.infer<typeof CreateSubscriptionRequest>;
export type CreateCustomerSubscriptionRequest = z.infer<typeof CreateCustomerSubscriptionRequest>;
export type CreateFormTemplateRequest = z.infer<typeof CreateFormTemplateRequest>;
export type UpdateFormTemplateRequest = z.infer<typeof UpdateFormTemplateRequest>;
export type CreateFormSubmissionRequest = z.infer<typeof CreateFormSubmissionRequest>;
export type UpdateFormSubmissionRequest = z.infer<typeof UpdateFormSubmissionRequest>;
export type FormSubmissionFilters = z.infer<typeof FormSubmissionFiltersSchema>;
export type CreateCustomerWorkflowRequest = z.infer<typeof CreateCustomerWorkflowRequest>;
export type UpdateCustomerWorkflowRequest = z.infer<typeof UpdateCustomerWorkflowRequest>;

// Enhanced Form Template Types
export type FormTemplateFilters = z.infer<typeof FormTemplateFiltersSchema>;
export type CreateCollectionRequest = z.infer<typeof CreateCollectionRequest>;
export type UpdateCollectionRequest = z.infer<typeof UpdateCollectionRequest>;
export type AddTemplateToCollectionRequest = z.infer<typeof AddTemplateToCollectionRequest>;

// Response Types
export type Facet = z.infer<typeof FacetSchema>;
export type GetTemplatesResponse = z.infer<typeof GetTemplatesResponseSchema>;
export type GetTemplateResponse = z.infer<typeof GetTemplateResponseSchema>;

export type PaginationQuery = z.infer<typeof PaginationSchema>;
export type FilterQuery = z.infer<typeof FilterSchema>;
export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

// Validation helper functions
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Invalid request data']
    };
  }
};

export const validateQueryParams = (url: URL, schema: z.ZodSchema) => {
  const params = Object.fromEntries(url.searchParams.entries());
  return validateRequest(schema, params);
};