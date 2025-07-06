// Form Builder API functions for IPLC Forms v3
// Following established API patterns from src/lib/api.ts

export interface FormComponent {
  id: string;
  type: 'text_input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number' | 'scale' |
        'clinical_scale' | 'assistance_level' | 'demographics' | 'standardized_test' | 'oral_motor' |
        'language_sample' | 'sensory_processing' | 'goals_planning' | 'clinical_signature' | 'cpt_code';
  label: string;
  order: number;
  props?: {
    required?: boolean;
    placeholder?: string;
    description?: string;
    options?: string[];
    min?: number;
    max?: number;
    validation?: {
      minLength?: number;
      maxLength?: number;
      pattern?: string;
      min?: number;
      max?: number;
    };
    conditional?: {
      field: string;
      value: any;
      operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    };
    // Clinical component specific properties
    scaleType?: string;
    labels?: string[];
    levels?: string[];
    fields?: string[];
    includeEmergencyContact?: boolean;
    includeInsurance?: boolean;
    testName?: string;
    includeRawScore?: boolean;
    includeStandardScore?: boolean;
    includePercentile?: boolean;
    includeAgeEquivalent?: boolean;
    structures?: string[];
    functions?: string[];
    includeReflexes?: boolean;
    sampleType?: string;
    duration?: number;
    analysisType?: string[];
    includeTranscript?: boolean;
    systems?: string[];
    responsePatterns?: string[];
    includeADLImpact?: boolean;
    goalType?: string;
    timeframe?: string;
    includeBaseline?: boolean;
    signatureType?: string;
    includeDate?: boolean;
    includeCredentials?: boolean;
    cptCodes?: string[];
    includeBilling?: boolean;
    includeJustification?: boolean;
  };
}

export interface FormTemplate {
  id?: number;
  name: string;
  description?: string;
  category: string;
  clinical_context?: string;
  version: number;
  schema: any;
  ui_schema?: any;
  scoring_config?: any;
  permissions?: any;
  metadata?: any;
  status: 'draft' | 'active' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface FormSubmission {
  id?: number;
  template_id: number;
  user_id?: string;
  form_data: any;
  calculated_score?: number;
  metadata?: any;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'deleted';
  submission_date?: string;
  created_at?: string;
  updated_at?: string;
}

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  [key: string]: any;
}

interface TemplatesResponse extends ApiResponse<FormTemplate[]> {
  templates: FormTemplate[];
}

interface TemplateResponse extends ApiResponse<FormTemplate> {
  template: FormTemplate;
}

interface SubmissionsResponse extends ApiResponse<FormSubmission[]> {
  submissions: FormSubmission[];
}

interface SubmissionResponse extends ApiResponse<FormSubmission> {
  submission: FormSubmission;
}

interface VersionsResponse extends ApiResponse<any[]> {
  versions: any[];
}

interface VersionResponse extends ApiResponse<any> {
  version: any;
}

interface AnalyticsResponse extends ApiResponse<any> {
  analytics?: any;
  insights?: any;
}

// Form Template API Functions
export const getFormTemplates = async (baseUrl: string, apiToken: string) => {
  const response = await fetch(`${baseUrl}/api/form-templates`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  
  if (response.ok) {
    const data = await response.json() as TemplatesResponse;
    return {
      templates: data.templates,
      success: true,
    };
  } else {
    console.error("Failed to fetch form templates");
    return {
      templates: [],
      success: false,
    };
  }
};

export const getFormTemplate = async (id: number, baseUrl: string, apiToken: string) => {
  const response = await fetch(`${baseUrl}/api/form-templates/${id}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  
  if (response.ok) {
    const data = await response.json() as TemplateResponse;
    return {
      template: data.template,
      success: true,
    };
  } else {
    console.error("Failed to fetch form template");
    return {
      template: null,
      success: false,
    };
  }
};

export const createFormTemplate = async (baseUrl: string, apiToken: string, template: Omit<FormTemplate, 'id'>) => {
  const response = await fetch(`${baseUrl}/api/form-templates`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(template),
  });
  
  if (response.ok) {
    const data = await response.json() as TemplateResponse;
    return {
      template: data.template,
      success: true,
    };
  } else {
    console.error("Failed to create form template");
    return {
      template: null,
      success: false,
    };
  }
};

export const updateFormTemplate = async (id: number, baseUrl: string, apiToken: string, template: Partial<FormTemplate>) => {
  const response = await fetch(`${baseUrl}/api/form-templates/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(template),
  });
  
  if (response.ok) {
    const data = await response.json() as TemplateResponse;
    return {
      template: data.template,
      success: true,
    };
  } else {
    console.error("Failed to update form template");
    return {
      template: null,
      success: false,
    };
  }
};

export const deleteFormTemplate = async (id: number, baseUrl: string, apiToken: string) => {
  const response = await fetch(`${baseUrl}/api/form-templates/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  
  if (response.ok) {
    return { success: true };
  } else {
    console.error("Failed to delete form template");
    return { success: false };
  }
};

// Form Template Version Management
export const getFormTemplateVersions = async (id: number, baseUrl: string, apiToken: string) => {
  const response = await fetch(`${baseUrl}/api/form-templates/${id}/versions`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  
  if (response.ok) {
    const data = await response.json() as VersionsResponse;
    return {
      versions: data.versions,
      success: true,
    };
  } else {
    console.error("Failed to fetch form template versions");
    return {
      versions: [],
      success: false,
    };
  }
};

export const createFormTemplateVersion = async (id: number, baseUrl: string, apiToken: string, versionData: any) => {
  const response = await fetch(`${baseUrl}/api/form-templates/${id}/versions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(versionData),
  });
  
  if (response.ok) {
    const data = await response.json() as VersionResponse;
    return {
      version: data.version,
      success: true,
    };
  } else {
    console.error("Failed to create form template version");
    return {
      version: null,
      success: false,
    };
  }
};

// Form Submission API Functions
export const getFormSubmissions = async (baseUrl: string, apiToken: string, filters?: Record<string, any>) => {
  const url = new URL(`${baseUrl}/api/form-submissions`);
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  
  if (response.ok) {
    const data = await response.json() as SubmissionsResponse;
    return {
      submissions: data.submissions,
      success: true,
    };
  } else {
    console.error("Failed to fetch form submissions");
    return {
      submissions: [],
      success: false,
    };
  }
};

export const createFormSubmission = async (baseUrl: string, apiToken: string, submission: Omit<FormSubmission, 'id'>) => {
  const response = await fetch(`${baseUrl}/api/form-submissions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  });
  
  if (response.ok) {
    const data = await response.json() as SubmissionResponse;
    return {
      submission: data.submission,
      success: true,
    };
  } else {
    console.error("Failed to create form submission");
    return {
      submission: null,
      success: false,
    };
  }
};

// Clinical Analytics API Functions
export const getFormAnalytics = async (baseUrl: string, apiToken: string, templateId?: number, options?: Record<string, any>) => {
  const url = new URL(`${baseUrl}/api/analytics/forms`);
  if (templateId) {
    url.searchParams.append('template_id', templateId.toString());
  }
  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  
  if (response.ok) {
    const data = await response.json() as AnalyticsResponse;
    return {
      analytics: data.analytics || data,
      success: true,
    };
  } else {
    console.error("Failed to fetch form analytics");
    return {
      analytics: null,
      success: false,
    };
  }
};

export const getClinicalInsights = async (baseUrl: string, apiToken: string) => {
  const response = await fetch(`${baseUrl}/api/analytics/forms?clinical_insights=true`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  
  if (response.ok) {
    const data = await response.json() as AnalyticsResponse;
    return {
      insights: data.insights || data,
      success: true,
    };
  } else {
    console.error("Failed to fetch clinical insights");
    return {
      insights: null,
      success: false,
    };
  }
};