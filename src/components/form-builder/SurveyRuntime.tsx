import React, { useEffect, useState } from 'react';
import type { FormComponent } from '@/lib/api-form-builder';

// Type definitions for SurveyJS
interface SurveyModel {
  data: any;
  onComplete: {
    add: (callback: (sender: any, options: any) => void) => void;
  };
  onValueChanged: {
    add: (callback: (sender: any, options: any) => void) => void;
  };
  render: (elementId?: string) => void;
  dispose: () => void;
}

interface SurveyReactUI {
  Model: new (json: any) => SurveyModel;
  Survey: React.ComponentType<{
    model: SurveyModel;
    onComplete?: (sender: any, options: any) => void;
    onValueChanged?: (sender: any, options: any) => void;
  }>;
  StylesManager: {
    applyTheme: (theme: string) => void;
  };
}

interface SurveyRuntimeProps {
  formSchema?: {
    components?: FormComponent[];
    pages?: any[];
    isMultiPage?: boolean;
  };
  formData?: Record<string, any>;
  onComplete?: (data: Record<string, any>) => void;
  onValueChanged?: (name: string, value: any) => void;
  theme?: 'default' | 'modern' | 'bootstrap';
  readOnly?: boolean;
  showProgressBar?: 'top' | 'bottom' | 'both' | 'none';
}

// Convert our form schema to SurveyJS format
function convertToSurveyJS(formSchema: SurveyRuntimeProps['formSchema']): any {
  if (!formSchema) {
    return { pages: [], showProgressBar: 'top' };
  }

  const surveyJson: any = {
    showProgressBar: 'top',
    showQuestionNumbers: 'off',
    pages: []
  };

  // Handle multi-page forms
  if (formSchema.isMultiPage && formSchema.pages) {
    formSchema.pages.forEach((page) => {
      const surveyPage: any = {
        name: page.id,
        title: page.title,
        description: page.description,
        elements: []
      };

      if (page.components) {
        page.components.forEach((component: FormComponent) => {
          const element = convertComponentToSurveyElement(component);
          if (element) {
            surveyPage.elements.push(element);
          }
        });
      }

      surveyJson.pages.push(surveyPage);
    });
  } else if (formSchema.components) {
    // Single page form
    const page: any = {
      name: 'page1',
      elements: []
    };

    formSchema.components.forEach((component) => {
      const element = convertComponentToSurveyElement(component);
      if (element) {
        page.elements.push(element);
      }
    });

    surveyJson.pages.push(page);
  }

  return surveyJson;
}

function convertComponentToSurveyElement(component: FormComponent): any {
  const baseElement: any = {
    name: component.id,
    title: component.label,
    isRequired: component.props?.required || false
  };

  // Add description if present
  if (component.props?.description) {
    baseElement.description = component.props.description;
  }

  // Add placeholder if present
  if (component.props?.placeholder) {
    baseElement.placeholder = component.props.placeholder;
  }

  // Handle conditional logic (visibility condition)
  if (component.props?.visibilityCondition) {
    const condition = component.props.visibilityCondition;
    if (condition.field && condition.value !== undefined) {
      // SurveyJS visibility expression
      const operator = condition.operator === 'equals' ? '=' :
                       condition.operator === 'not_equals' ? '!=' :
                       condition.operator === 'contains' ? 'contains' : '=';
      
      baseElement.visibleIf = `{${condition.field}} ${operator} '${condition.value}'`;
    }
  }

  // Convert based on component type
  switch (component.type) {
    case 'text_input':
      return {
        ...baseElement,
        type: 'text',
        maxLength: component.props?.validation?.maxLength
      };

    case 'textarea':
      return {
        ...baseElement,
        type: 'comment',
        rows: 4,
        maxLength: component.props?.validation?.maxLength
      };

    case 'number':
      return {
        ...baseElement,
        type: 'text',
        inputType: 'number',
        min: component.props?.min || component.props?.validation?.min,
        max: component.props?.max || component.props?.validation?.max
      };

    case 'date':
      return {
        ...baseElement,
        type: 'text',
        inputType: 'date'
      };

    case 'select':
      return {
        ...baseElement,
        type: 'dropdown',
        choices: component.props?.options?.map((opt: string) => ({
          value: opt,
          text: opt
        })) || []
      };

    case 'radio':
      return {
        ...baseElement,
        type: 'radiogroup',
        choices: component.props?.options?.map((opt: string) => ({
          value: opt,
          text: opt
        })) || []
      };

    case 'checkbox':
      return {
        ...baseElement,
        type: 'checkbox',
        choices: component.props?.options?.map((opt: string) => ({
          value: opt,
          text: opt
        })) || []
      };

    case 'scale':
    case 'clinical_scale':
      return {
        ...baseElement,
        type: 'rating',
        rateMin: component.props?.min || 1,
        rateMax: component.props?.max || 5,
        minRateDescription: component.props?.labels?.[0],
        maxRateDescription: component.props?.labels?.[component.props?.labels?.length - 1]
      };

    case 'clinical_signature':
      return {
        ...baseElement,
        type: 'signaturepad',
        width: 300,
        height: 200
      };

    case 'title_subtitle':
      return {
        type: 'html',
        name: component.id,
        html: `<h2>${component.props?.text || component.label || ''}</h2>`
      };

    case 'subtitle':
      return {
        type: 'html',
        name: component.id,
        html: `<h3>${component.props?.text || component.label || ''}</h3>`
      };

    case 'line_separator':
      return {
        type: 'html',
        name: component.id,
        html: '<hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />'
      };

    case 'ai_summary':
      // AI summary would be handled separately, return null for now
      return null;

    case 'evaluation_section':
      // Evaluation sections are containers, handle their fields
      return {
        type: 'panel',
        name: component.id,
        title: component.label,
        elements: component.fields?.map((field: any) => ({
          type: 'text',
          name: field.id || field.name,
          title: field.label || field.name
        })) || []
      };

    case 'demographics':
    case 'standardized_test':
    case 'oral_motor':
    case 'language_sample':
    case 'sensory_processing':
    case 'goals_planning':
    case 'cpt_code':
    case 'assistance_level':
    case 'clinical_component':
      // For clinical components, create a panel with structured fields
      return {
        type: 'panel',
        name: component.id,
        title: component.label,
        elements: component.fields?.map((field: any) => ({
          type: field.type === 'select' ? 'dropdown' :
                field.type === 'checkbox' ? 'checkbox' :
                field.type === 'radio' ? 'radiogroup' : 'text',
          name: field.id || field.name,
          title: field.label || field.name,
          choices: field.options?.map((opt: any) => ({
            value: typeof opt === 'string' ? opt : opt.value,
            text: typeof opt === 'string' ? opt : opt.label
          }))
        })) || [{
          type: 'html',
          html: `<div class="clinical-component">${component.label || component.type}</div>`
        }]
      };

    default:
      // For unknown components, create a panel with HTML
      return {
        type: 'panel',
        name: component.id,
        title: component.label,
        elements: [{
          type: 'html',
          html: `<div class="custom-component">${component.label || component.type}</div>`
        }]
      };
  }
}

const SurveyRuntime: React.FC<SurveyRuntimeProps> = ({
  formSchema,
  formData = {},
  onComplete,
  onValueChanged,
  theme = 'modern',
  readOnly = false,
  showProgressBar = 'top'
}) => {
  const [Survey, setSurvey] = useState<any>(null);
  const [surveyModel, setSurveyModel] = useState<SurveyModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import SurveyJS only on client side
    const loadSurvey = async () => {
      try {
        const surveyModule = await import('survey-react-ui');
        const Survey = surveyModule.Survey;
        const Model = surveyModule.Model;
        
        // Try to apply theme if StylesManager is available
        if ('StylesManager' in surveyModule) {
          const StylesManager = (surveyModule as any).StylesManager;
          StylesManager.applyTheme(theme);
        }

        // Convert our schema to SurveyJS format
        const surveyJson = convertToSurveyJS(formSchema);
        surveyJson.showProgressBar = showProgressBar;

        // Create survey model
        const model = new Model(surveyJson);

        // Set initial data if provided
        if (formData && Object.keys(formData).length > 0) {
          model.data = formData;
        }

        // Set read-only mode
        if (readOnly) {
          (model as any).mode = 'display';
        }

        // Add event handlers
        if (onComplete) {
          model.onComplete.add((sender: any, options: any) => {
            onComplete(sender.data);
          });
        }

        if (onValueChanged) {
          model.onValueChanged.add((sender: any, options: any) => {
            onValueChanged(options.name, options.value);
          });
        }

        setSurvey(Survey);
        setSurveyModel(model);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load SurveyJS:', err);
        setError('Failed to load survey component');
        setIsLoading(false);
      }
    };

    // Only load on client side
    if (typeof window !== 'undefined') {
      loadSurvey();
    }

    // Cleanup
    return () => {
      if (surveyModel) {
        surveyModel.dispose();
      }
    };
  }, [formSchema, theme, readOnly, showProgressBar]);

  // Update data when formData prop changes
  useEffect(() => {
    if (surveyModel && formData) {
      surveyModel.data = formData;
    }
  }, [formData, surveyModel]);

  if (typeof window === 'undefined') {
    // SSR - return loading placeholder
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-red-50 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading form</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!Survey || !surveyModel) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <p className="text-gray-600">No form data available</p>
      </div>
    );
  }

  return (
    <div className="survey-runtime-container">
      <Survey model={surveyModel} />
    </div>
  );
};

export default SurveyRuntime;