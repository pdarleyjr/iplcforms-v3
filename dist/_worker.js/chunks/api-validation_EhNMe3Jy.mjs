globalThis.process ??= {}; globalThis.process.env ??= {};
import { o as object, s as string, n as number, a as array, u as union, _ as _enum, b as boolean, d as any, r as record, f as number$1, g as boolean$1, Z as ZodError } from './form-vendor_rc_Y5fZa.mjs';

const CustomerSchema = object({
  id: number().optional(),
  name: string().min(2, "Name must be at least 2 characters").max(100),
  email: string().email("Invalid email address").max(255),
  notes: string().max(1e3).optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const SubscriptionSchema = object({
  id: number().optional(),
  name: string().min(2, "Name must be at least 2 characters").max(100),
  description: string().max(500).optional(),
  price: number().positive("Price must be positive"),
  features: array(object({
    name: string().min(1).max(100),
    description: string().max(300).optional()
  })).optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const CustomerSubscriptionSchema = object({
  id: number().optional(),
  customer_id: number().positive("Customer ID must be positive"),
  subscription_id: number().positive("Subscription ID must be positive"),
  status: _enum(["active", "inactive", "cancelled", "paused"]),
  subscription_starts_at: string().datetime().optional(),
  subscription_ends_at: union([string().datetime(), number()]).optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const FormComponentSchema = object({
  id: string().min(1),
  type: _enum([
    "text_input",
    "textarea",
    "select",
    "radio",
    "checkbox",
    "date",
    "number",
    "scale",
    "clinical_scale",
    "assistance_level",
    "demographics",
    "standardized_test",
    "oral_motor",
    "language_sample",
    "sensory_processing",
    "goals_planning",
    "clinical_signature",
    "cpt_code",
    "ai_summary",
    "title_subtitle",
    "subtitle",
    "line_separator",
    "evaluation_section",
    "clinical_component"
  ]),
  label: string().min(1, "Label is required").max(200),
  order: number().min(0),
  sectionId: string().optional(),
  // For evaluation_section components
  collapsed: boolean().optional(),
  // For evaluation_section components
  props: object({
    required: boolean().optional(),
    placeholder: string().max(200).optional(),
    description: string().max(500).optional(),
    options: array(string().max(100)).optional(),
    min: number().optional(),
    max: number().optional(),
    validation: object({
      minLength: number().min(0).optional(),
      maxLength: number().min(1).optional(),
      pattern: string().optional(),
      min: number().optional(),
      max: number().optional()
    }).optional(),
    visibilityCondition: object({
      field: string().min(1),
      value: any(),
      operator: _enum(["equals", "not_equals", "contains", "greater_than", "less_than"])
    }).optional(),
    // AI Summary specific props
    ai_summary: object({
      auto_select_fields: boolean().optional(),
      default_prompt: string().max(1e3).optional(),
      max_length: number().min(50).max(2e3).optional(),
      include_medical_context: boolean().optional()
    }).optional(),
    // Title/Subtitle specific props
    title_subtitle: object({
      text: string().max(500),
      level: _enum(["h1", "h2", "h3", "h4", "h5", "h6"]).default("h2"),
      fontFamily: _enum(["system", "serif", "sans-serif", "monospace"]).default("system"),
      fontSize: _enum(["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"]).default("base"),
      fontWeight: _enum(["normal", "medium", "semibold", "bold"]).default("normal"),
      color: string().regex(/^#[0-9A-F]{6}$/i).default("#000000"),
      alignment: _enum(["left", "center", "right"]).default("left"),
      marginTop: number().min(0).max(100).default(0),
      marginBottom: number().min(0).max(100).default(0),
      enableMarkdown: boolean().default(false)
    }).optional(),
    // Line Separator specific props
    line_separator: object({
      thickness: number().min(1).max(10).default(1),
      color: string().regex(/^#[0-9A-F]{6}$/i).default("#CCCCCC"),
      style: _enum(["solid", "dashed", "dotted"]).default("solid"),
      width: number().min(10).max(100).default(100),
      alignment: _enum(["left", "center", "right"]).default("center"),
      marginTop: number().min(0).max(100).default(10),
      marginBottom: number().min(0).max(100).default(10)
    }).optional()
  }).optional()
});
const FormPageSchema = object({
  id: string().min(1),
  title: string().min(1).max(200),
  description: string().max(500).optional(),
  order: number().min(0),
  components: array(FormComponentSchema)
});
const FormTemplateSchema = object({
  id: number().optional(),
  name: string().min(2, "Name must be at least 2 characters").max(200),
  description: string().max(1e3).optional(),
  category: _enum(["assessment", "intake", "treatment", "outcome", "research", "other"]),
  subcategory: string().max(100).optional(),
  clinical_context: string().min(2, "Clinical context is required").max(1e3),
  version: number().min(1).default(1),
  schema: object({
    // Support both single-page (components) and multi-page (pages) forms
    components: array(FormComponentSchema).optional(),
    pages: array(FormPageSchema).optional(),
    isMultiPage: boolean().optional().default(false)
  }).refine(
    (data) => {
      return data.components && data.components.length > 0 || data.pages && data.pages.length > 0;
    },
    {
      message: "Form must have either components or pages"
    }
  ),
  ui_schema: record(string(), any()).optional(),
  scoring_config: record(string(), any()).optional(),
  permissions: record(string(), any()).optional(),
  metadata: object({
    showIplcLogo: boolean().optional()
  }).catchall(any()).optional(),
  // Enhanced metadata fields
  tags: array(string().max(50)).max(20).optional(),
  clinical_codes: object({
    icd10: array(string()).optional(),
    snomed: array(string()).optional(),
    loinc: array(string()).optional(),
    custom: record(string(), array(string())).optional()
  }).optional(),
  target_audience: array(_enum(["adult", "pediatric", "geriatric", "adolescent", "all_ages"])).optional(),
  estimated_completion_time: number().min(1).max(480).optional(),
  // 1 minute to 8 hours
  change_log: array(object({
    version: number().min(1),
    date: string().datetime(),
    changes: string().max(1e3),
    changed_by: number().positive()
  })).optional(),
  collaborators: array(object({
    user_id: number().positive(),
    role: _enum(["editor", "reviewer", "viewer"]),
    added_at: string().datetime(),
    added_by: number().positive()
  })).optional(),
  usage_stats: object({
    total_submissions: number().min(0).default(0),
    unique_users: number().min(0).default(0),
    last_used: string().datetime().optional(),
    avg_completion_time: number().min(0).optional(),
    completion_rate: number().min(0).max(100).optional()
  }).optional(),
  status: _enum(["draft", "active", "archived"]).default("draft"),
  created_by: number().positive().optional(),
  updated_by: number().positive().optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const FormSubmissionSchema = object({
  id: number().optional(),
  template_id: number().positive("Template ID is required"),
  user_id: string().optional(),
  form_data: record(string(), any()),
  calculated_score: number().optional(),
  metadata: record(string(), any()).optional(),
  status: _enum(["draft", "submitted", "reviewed", "approved", "deleted"]).default("draft"),
  submission_date: string().datetime().optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const FormTemplateCollectionSchema = object({
  id: number().optional(),
  name: string().min(2, "Collection name must be at least 2 characters").max(200),
  description: string().max(1e3).optional(),
  organization_id: number().positive().optional(),
  is_public: boolean().default(false),
  metadata: record(string(), any()).optional(),
  created_by: number().positive().optional(),
  updated_by: number().positive().optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const FormTemplateCollectionItemSchema = object({
  id: number().optional(),
  collection_id: number().positive("Collection ID is required"),
  template_id: number().positive("Template ID is required"),
  order_index: number().min(0).default(0),
  added_by: number().positive().optional(),
  added_at: string().optional()
});
object({
  id: number().optional(),
  name: _enum(["patient", "clinician", "admin", "researcher", "supervisor"]),
  description: string().max(500).optional(),
  permissions: array(string()),
  created_at: string().optional(),
  updated_at: string().optional()
});
object({
  user_id: string().min(1),
  role: _enum(["patient", "clinician", "admin", "researcher", "supervisor"]),
  resource_type: _enum(["form_template", "form_submission", "customer", "subscription", "analytics"]),
  resource_id: number().optional(),
  permissions: array(_enum(["read", "write", "delete", "admin", "clinical_review"]))
});
object({
  type: string().min(1),
  data: record(string(), any()),
  timestamp: string().datetime().optional()
});
const CustomerWorkflowSchema = object({
  customer_id: number().positive("Customer ID is required"),
  workflow_type: _enum(["onboarding", "assessment", "treatment", "follow_up"]).default("onboarding"),
  parameters: record(string(), any()).optional()
});
const CreateCustomerRequest = CustomerSchema.omit({ id: true, created_at: true, updated_at: true });
CustomerSchema.partial().omit({ id: true, created_at: true, updated_at: true });
const CreateSubscriptionRequest = SubscriptionSchema.omit({ id: true, created_at: true, updated_at: true });
SubscriptionSchema.partial().omit({ id: true, created_at: true, updated_at: true });
const CreateCustomerSubscriptionRequest = CustomerSubscriptionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});
FormTemplateSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});
const UpdateFormTemplateRequest = FormTemplateSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true
});
FormTemplateCollectionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});
FormTemplateCollectionSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true
});
FormTemplateCollectionItemSchema.omit({
  id: true,
  added_at: true
});
const CreateFormSubmissionRequest = FormSubmissionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  submission_date: true
});
const UpdateFormSubmissionRequest = FormSubmissionSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true
});
const FormSubmissionFiltersSchema = object({
  template_id: number$1().positive().optional(),
  patient_id: number$1().positive().optional(),
  status: _enum(["draft", "submitted", "reviewed", "approved", "deleted"]).optional(),
  date_from: string().optional(),
  date_to: string().optional(),
  page: number$1().min(1).default(1).optional(),
  per_page: number$1().min(1).max(100).default(10).optional()
});
CustomerWorkflowSchema.partial();
const PaginationSchema = object({
  page: number$1().min(1).default(1),
  limit: number$1().min(1).max(100).default(20)
});
object({
  status: string().optional(),
  category: string().optional(),
  user_id: string().optional(),
  date_from: string().datetime().optional(),
  date_to: string().datetime().optional()
});
const FormTemplateFiltersSchema = object({
  search: string().max(200).optional(),
  category: _enum(["assessment", "intake", "treatment", "outcome", "research", "other"]).optional(),
  subcategory: string().max(100).optional(),
  tags: array(string().max(50)).optional(),
  organization: number$1().positive().optional(),
  status: _enum(["draft", "active", "archived"]).optional(),
  target_audience: _enum(["adult", "pediatric", "geriatric", "adolescent", "all_ages"]).optional(),
  clinical_codes: object({
    icd10: array(string()).optional(),
    snomed: array(string()).optional(),
    loinc: array(string()).optional()
  }).optional(),
  created_by: number$1().positive().optional(),
  updated_since: string().datetime().optional(),
  min_completion_time: number$1().min(1).optional(),
  max_completion_time: number$1().min(1).optional(),
  has_collaborators: boolean$1().optional(),
  collection_id: number$1().positive().optional(),
  sort_by: _enum(["name", "created_at", "updated_at", "usage_count", "completion_time"]).default("updated_at"),
  sort_order: _enum(["asc", "desc"]).default("desc"),
  page: number$1().min(1).default(1),
  per_page: number$1().min(1).max(100).default(20),
  include_facets: boolean$1().default(false)
});
object({
  template_id: number$1().positive().optional(),
  date_range: _enum(["7d", "30d", "90d", "1y"]).default("30d"),
  clinical_insights: boolean$1().default(false),
  include_demographics: boolean$1().default(false),
  group_by: _enum(["day", "week", "month"]).default("day")
});
object({
  success: boolean(),
  message: string().optional(),
  data: any().optional(),
  errors: array(string()).optional(),
  pagination: object({
    page: number(),
    limit: number(),
    total: number(),
    pages: number()
  }).optional()
});
const FacetSchema = object({
  name: string(),
  values: array(object({
    value: string(),
    count: number(),
    label: string().optional()
  }))
});
object({
  success: boolean(),
  data: object({
    templates: array(FormTemplateSchema),
    pagination: object({
      page: number(),
      per_page: number(),
      total: number(),
      pages: number()
    }),
    facets: array(FacetSchema).optional(),
    aggregations: object({
      total_templates: number(),
      categories: record(string(), number()),
      avg_completion_time: number().optional(),
      most_used_tags: array(object({
        tag: string(),
        count: number()
      })).optional()
    }).optional()
  }),
  message: string().optional()
});
object({
  success: boolean(),
  data: object({
    template: FormTemplateSchema,
    related_templates: array(FormTemplateSchema.pick({
      id: true,
      name: true,
      category: true,
      description: true
    })).optional(),
    usage_analytics: object({
      recent_submissions: number(),
      performance_metrics: record(string(), any())
    }).optional()
  }),
  message: string().optional()
});
const validateRequest = (schema, data) => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.issues.map((err) => `${err.path.join(".")}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ["Invalid request data"]
    };
  }
};
const validateQueryParams = (url, schema) => {
  const params = Object.fromEntries(url.searchParams.entries());
  return validateRequest(schema, params);
};

export { CreateCustomerSubscriptionRequest as C, FormSubmissionFiltersSchema as F, PaginationSchema as P, UpdateFormSubmissionRequest as U, validateRequest as a, CreateCustomerRequest as b, CreateFormSubmissionRequest as c, FormTemplateSchema as d, FormTemplateFiltersSchema as e, UpdateFormTemplateRequest as f, CreateSubscriptionRequest as g, CustomerWorkflowSchema as h, validateQueryParams as v };
//# sourceMappingURL=api-validation_EhNMe3Jy.mjs.map
