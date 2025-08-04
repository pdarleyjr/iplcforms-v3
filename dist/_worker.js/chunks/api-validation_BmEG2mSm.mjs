globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as _coercedNumber, b as _coercedBoolean, Z as ZodNumber, c as ZodBoolean, o as object, s as string, n as number$1, d as array, u as union, _ as _enum, e as boolean$1, f as any, r as record, g as ZodError } from './schemas_RvMANBrn.mjs';

function number(params) {
    return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
    return _coercedBoolean(ZodBoolean, params);
}

const CustomerSchema = object({
  id: number$1().optional(),
  name: string().min(2, "Name must be at least 2 characters").max(100),
  email: string().email("Invalid email address").max(255),
  notes: string().max(1e3).optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const SubscriptionSchema = object({
  id: number$1().optional(),
  name: string().min(2, "Name must be at least 2 characters").max(100),
  description: string().max(500).optional(),
  price: number$1().positive("Price must be positive"),
  features: array(object({
    name: string().min(1).max(100),
    description: string().max(300).optional()
  })).optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const CustomerSubscriptionSchema = object({
  id: number$1().optional(),
  customer_id: number$1().positive("Customer ID must be positive"),
  subscription_id: number$1().positive("Subscription ID must be positive"),
  status: _enum(["active", "inactive", "cancelled", "paused"]),
  subscription_starts_at: string().datetime().optional(),
  subscription_ends_at: union([string().datetime(), number$1()]).optional(),
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
  order: number$1().min(0),
  sectionId: string().optional(),
  // For evaluation_section components
  collapsed: boolean$1().optional(),
  // For evaluation_section components
  props: object({
    required: boolean$1().optional(),
    placeholder: string().max(200).optional(),
    description: string().max(500).optional(),
    options: array(string().max(100)).optional(),
    min: number$1().optional(),
    max: number$1().optional(),
    validation: object({
      minLength: number$1().min(0).optional(),
      maxLength: number$1().min(1).optional(),
      pattern: string().optional(),
      min: number$1().optional(),
      max: number$1().optional()
    }).optional(),
    visibilityCondition: object({
      field: string().min(1),
      value: any(),
      operator: _enum(["equals", "not_equals", "contains", "greater_than", "less_than"])
    }).optional(),
    // AI Summary specific props
    ai_summary: object({
      auto_select_fields: boolean$1().optional(),
      default_prompt: string().max(1e3).optional(),
      max_length: number$1().min(50).max(2e3).optional(),
      include_medical_context: boolean$1().optional()
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
      marginTop: number$1().min(0).max(100).default(0),
      marginBottom: number$1().min(0).max(100).default(0),
      enableMarkdown: boolean$1().default(false)
    }).optional(),
    // Line Separator specific props
    line_separator: object({
      thickness: number$1().min(1).max(10).default(1),
      color: string().regex(/^#[0-9A-F]{6}$/i).default("#CCCCCC"),
      style: _enum(["solid", "dashed", "dotted"]).default("solid"),
      width: number$1().min(10).max(100).default(100),
      alignment: _enum(["left", "center", "right"]).default("center"),
      marginTop: number$1().min(0).max(100).default(10),
      marginBottom: number$1().min(0).max(100).default(10)
    }).optional()
  }).optional()
});
const FormPageSchema = object({
  id: string().min(1),
  title: string().min(1).max(200),
  description: string().max(500).optional(),
  order: number$1().min(0),
  components: array(FormComponentSchema)
});
const FormTemplateSchema = object({
  id: number$1().optional(),
  name: string().min(2, "Name must be at least 2 characters").max(200),
  description: string().max(1e3).optional(),
  category: _enum(["assessment", "intake", "treatment", "outcome", "research", "other"]),
  subcategory: string().max(100).optional(),
  clinical_context: string().min(2, "Clinical context is required").max(1e3),
  version: number$1().min(1).default(1),
  schema: object({
    // Support both single-page (components) and multi-page (pages) forms
    components: array(FormComponentSchema).optional(),
    pages: array(FormPageSchema).optional(),
    isMultiPage: boolean$1().optional().default(false)
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
    showIplcLogo: boolean$1().optional()
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
  estimated_completion_time: number$1().min(1).max(480).optional(),
  // 1 minute to 8 hours
  change_log: array(object({
    version: number$1().min(1),
    date: string().datetime(),
    changes: string().max(1e3),
    changed_by: number$1().positive()
  })).optional(),
  collaborators: array(object({
    user_id: number$1().positive(),
    role: _enum(["editor", "reviewer", "viewer"]),
    added_at: string().datetime(),
    added_by: number$1().positive()
  })).optional(),
  usage_stats: object({
    total_submissions: number$1().min(0).default(0),
    unique_users: number$1().min(0).default(0),
    last_used: string().datetime().optional(),
    avg_completion_time: number$1().min(0).optional(),
    completion_rate: number$1().min(0).max(100).optional()
  }).optional(),
  status: _enum(["draft", "active", "archived"]).default("draft"),
  created_by: number$1().positive().optional(),
  updated_by: number$1().positive().optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const FormSubmissionSchema = object({
  id: number$1().optional(),
  template_id: number$1().positive("Template ID is required"),
  user_id: string().optional(),
  form_data: record(string(), any()),
  calculated_score: number$1().optional(),
  metadata: record(string(), any()).optional(),
  status: _enum(["draft", "submitted", "reviewed", "approved", "deleted"]).default("draft"),
  submission_date: string().datetime().optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const FormTemplateCollectionSchema = object({
  id: number$1().optional(),
  name: string().min(2, "Collection name must be at least 2 characters").max(200),
  description: string().max(1e3).optional(),
  organization_id: number$1().positive().optional(),
  is_public: boolean$1().default(false),
  metadata: record(string(), any()).optional(),
  created_by: number$1().positive().optional(),
  updated_by: number$1().positive().optional(),
  created_at: string().optional(),
  updated_at: string().optional()
});
const FormTemplateCollectionItemSchema = object({
  id: number$1().optional(),
  collection_id: number$1().positive("Collection ID is required"),
  template_id: number$1().positive("Template ID is required"),
  order_index: number$1().min(0).default(0),
  added_by: number$1().positive().optional(),
  added_at: string().optional()
});
object({
  id: number$1().optional(),
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
  resource_id: number$1().optional(),
  permissions: array(_enum(["read", "write", "delete", "admin", "clinical_review"]))
});
object({
  type: string().min(1),
  data: record(string(), any()),
  timestamp: string().datetime().optional()
});
const CustomerWorkflowSchema = object({
  customer_id: number$1().positive("Customer ID is required"),
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
  template_id: number().positive().optional(),
  patient_id: number().positive().optional(),
  status: _enum(["draft", "submitted", "reviewed", "approved", "deleted"]).optional(),
  date_from: string().optional(),
  date_to: string().optional(),
  page: number().min(1).default(1).optional(),
  per_page: number().min(1).max(100).default(10).optional()
});
CustomerWorkflowSchema.partial();
const PaginationSchema = object({
  page: number().min(1).default(1),
  limit: number().min(1).max(100).default(20)
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
  organization: number().positive().optional(),
  status: _enum(["draft", "active", "archived"]).optional(),
  target_audience: _enum(["adult", "pediatric", "geriatric", "adolescent", "all_ages"]).optional(),
  clinical_codes: object({
    icd10: array(string()).optional(),
    snomed: array(string()).optional(),
    loinc: array(string()).optional()
  }).optional(),
  created_by: number().positive().optional(),
  updated_since: string().datetime().optional(),
  min_completion_time: number().min(1).optional(),
  max_completion_time: number().min(1).optional(),
  has_collaborators: boolean().optional(),
  collection_id: number().positive().optional(),
  sort_by: _enum(["name", "created_at", "updated_at", "usage_count", "completion_time"]).default("updated_at"),
  sort_order: _enum(["asc", "desc"]).default("desc"),
  page: number().min(1).default(1),
  per_page: number().min(1).max(100).default(20),
  include_facets: boolean().default(false)
});
object({
  template_id: number().positive().optional(),
  date_range: _enum(["7d", "30d", "90d", "1y"]).default("30d"),
  clinical_insights: boolean().default(false),
  include_demographics: boolean().default(false),
  group_by: _enum(["day", "week", "month"]).default("day")
});
object({
  success: boolean$1(),
  message: string().optional(),
  data: any().optional(),
  errors: array(string()).optional(),
  pagination: object({
    page: number$1(),
    limit: number$1(),
    total: number$1(),
    pages: number$1()
  }).optional()
});
const FacetSchema = object({
  name: string(),
  values: array(object({
    value: string(),
    count: number$1(),
    label: string().optional()
  }))
});
object({
  success: boolean$1(),
  data: object({
    templates: array(FormTemplateSchema),
    pagination: object({
      page: number$1(),
      per_page: number$1(),
      total: number$1(),
      pages: number$1()
    }),
    facets: array(FacetSchema).optional(),
    aggregations: object({
      total_templates: number$1(),
      categories: record(string(), number$1()),
      avg_completion_time: number$1().optional(),
      most_used_tags: array(object({
        tag: string(),
        count: number$1()
      })).optional()
    }).optional()
  }),
  message: string().optional()
});
object({
  success: boolean$1(),
  data: object({
    template: FormTemplateSchema,
    related_templates: array(FormTemplateSchema.pick({
      id: true,
      name: true,
      category: true,
      description: true
    })).optional(),
    usage_analytics: object({
      recent_submissions: number$1(),
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
//# sourceMappingURL=api-validation_BmEG2mSm.mjs.map
