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
  type: z.enum(['text_input', 'textarea', 'select', 'radio', 'checkbox', 'date', 'number', 'scale', 'ai_summary']),
  label: z.string().min(1, "Label is required").max(200),
  order: z.number().min(0),
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
    conditional: z.object({
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
  }).optional(),
});

export const FormTemplateSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(['assessment', 'intake', 'treatment', 'outcome', 'research', 'other']),
  clinical_context: z.string().min(2, "Clinical context is required").max(1000),
  version: z.number().min(1).default(1),
  schema: z.object({
    components: z.array(FormComponentSchema),
  }),
  ui_schema: z.record(z.string(), z.any()).optional(),
  scoring_config: z.record(z.string(), z.any()).optional(),
  permissions: z.record(z.string(), z.any()).optional(),
  metadata: z.object({
    showIplcLogo: z.boolean().optional(),
  }).catchall(z.any()).optional(),
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

// Type exports for use throughout the application
export type Customer = z.infer<typeof CustomerSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type CustomerSubscription = z.infer<typeof CustomerSubscriptionSchema>;
export type FormComponent = z.infer<typeof FormComponentSchema>;
export type FormTemplate = z.infer<typeof FormTemplateSchema>;
export type FormSubmission = z.infer<typeof FormSubmissionSchema>;
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