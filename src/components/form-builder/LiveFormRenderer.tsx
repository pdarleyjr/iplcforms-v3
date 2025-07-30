// Live Form Renderer Component for IPLC Forms v3
// Handles actual form data collection and submission with AI Summary support

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import type { FormComponent, FormTemplate } from '@/lib/api-form-builder';
import type { FormPage } from '@/lib/schemas/api-validation';
import { Calendar, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { AISummaryElement } from './components/AISummaryElement';
import TitleElement from './components/TitleElement';
import SubtitleElement from './components/SubtitleElement';
import SeparatorElement from './components/SeparatorElement';
import evaluationSectionsConfig from './evaluation-sections-config.json';

interface LiveFormRendererProps {
  template: FormTemplate;
  onSubmit?: (formData: FormSubmissionData) => void;
  className?: string;
}

interface FormSubmissionData {
  template_id: number;
  responses: Record<string, any>;
  metadata?: Record<string, any>;
}

export const LiveFormRenderer: React.FC<LiveFormRendererProps> = ({
  template,
  onSubmit,
  className = ''
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if this is a multi-page form
  const isMultiPage = template.schema?.isMultiPage || false;
  const pages = useMemo(() => {
    if (isMultiPage && template.schema?.pages) {
      const parsedPages = typeof template.schema.pages === 'string'
        ? JSON.parse(template.schema.pages)
        : template.schema.pages;
      return [...parsedPages].sort((a: FormPage, b: FormPage) => a.order - b.order);
    }
    return [];
  }, [isMultiPage, template.schema]);

  // State for multi-page navigation
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Get components based on whether it's multi-page or single-page
  const sortedComponents = useMemo(() => {
    let components: FormComponent[] = [];
    
    if (isMultiPage && pages.length > 0) {
      // Get components from current page
      const currentPage = pages[currentPageIndex];
      if (currentPage && currentPage.components) {
        components = typeof currentPage.components === 'string'
          ? JSON.parse(currentPage.components)
          : currentPage.components;
      }
    } else {
      // Single-page form
      components = Array.isArray(template.schema?.components) ? template.schema.components :
                  typeof template.schema?.components === 'string' ? JSON.parse(template.schema.components) : [];
    }
    
    // Sort components by order
    return [...components].sort((a, b) => a.order - b.order);
  }, [isMultiPage, pages, currentPageIndex, template.schema]);

  // Function to evaluate visibility conditions
  const evaluateVisibilityCondition = (component: FormComponent): boolean => {
    const condition = component.props?.visibilityCondition;
    if (!condition) return true;

    const triggerValue = formData[condition.field];
    const conditionValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return triggerValue == conditionValue;
      case 'not_equals':
        return triggerValue != conditionValue;
      case 'contains':
        return String(triggerValue || '').includes(String(conditionValue));
      case 'greater_than':
        return Number(triggerValue) > Number(conditionValue);
      case 'less_than':
        return Number(triggerValue) < Number(conditionValue);
      default:
        return true;
    }
  };

  // Filter components based on visibility conditions
  const visibleComponents = sortedComponents.filter(evaluateVisibilityCondition);

  const updateFormData = (componentId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [componentId]: value
    }));

    // Clear error for this field if it exists
    if (errors[componentId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[componentId];
        return newErrors;
      });
    }
  };

  const updateComponentData = (componentId: string, updates: any) => {
    // Find the component and update its props
    const componentIndex = sortedComponents.findIndex(c => c.id === componentId);
    if (componentIndex !== -1) {
      sortedComponents[componentIndex] = {
        ...sortedComponents[componentIndex],
        props: {
          ...sortedComponents[componentIndex].props,
          ...updates
        }
      };
    }
  };

  const validateForm = (componentsToValidate?: FormComponent[]): boolean => {
    const newErrors: Record<string, string> = {};
    const components = componentsToValidate || visibleComponents;

    // Only validate visible components
    components.forEach(component => {
      const { id, props = {}, label } = component;
      const isRequired = props.required || false;
      const value = formData[id];

      if (isRequired && (!value || value === '')) {
        newErrors[id] = `${label} is required`;
      }

      // Validate number fields
      if (component.type === 'number' && value !== undefined && value !== '') {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          newErrors[id] = `${label} must be a valid number`;
        } else {
          if (props.min !== undefined && numValue < props.min) {
            newErrors[id] = `${label} must be at least ${props.min}`;
          }
          if (props.max !== undefined && numValue > props.max) {
            newErrors[id] = `${label} must be at most ${props.max}`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers for multi-page forms
  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      // Clear errors when navigating
      setErrors({});
    }
  };

  const handleNextPage = () => {
    // Validate current page before moving to next
    if (validateForm(visibleComponents)) {
      if (currentPageIndex < pages.length - 1) {
        setCurrentPageIndex(currentPageIndex + 1);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Collect AI summary data from visible components
      const aiSummaryData: Record<string, any> = {};
      visibleComponents.forEach(component => {
        if (component.type === 'ai_summary' && component.props?.aiSummaryData) {
          aiSummaryData[component.id] = component.props.aiSummaryData;
        }
      });

      // For multi-page forms, we need to include data from all pages
      const allFormData: Record<string, any> = {};
      
      if (isMultiPage) {
        // Collect data from all pages
        pages.forEach((page: FormPage) => {
          const pageComponents = typeof page.components === 'string'
            ? JSON.parse(page.components)
            : page.components;
          
          pageComponents.forEach((component: FormComponent) => {
            if (evaluateVisibilityCondition(component) && formData[component.id] !== undefined) {
              allFormData[component.id] = formData[component.id];
            }
          });
        });
      } else {
        // Single-page form - only include visible fields
        visibleComponents.forEach(component => {
          if (formData[component.id] !== undefined) {
            allFormData[component.id] = formData[component.id];
          }
        });
      }

      const submissionData: FormSubmissionData = {
        template_id: template.id!,
        responses: {
          ...allFormData,
          ...aiSummaryData
        },
        metadata: {
          submitted_at: new Date().toISOString(),
          form_version: template.version,
          ai_summaries: Object.keys(aiSummaryData),
          is_multi_page: isMultiPage,
          total_pages: isMultiPage ? pages.length : 1
        }
      };

      if (onSubmit) {
        await onSubmit(submissionData);
      } else {
        // Default submission to API
        const response = await fetch('/api/form-submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            template_id: submissionData.template_id,
            form_data: submissionData.responses,
            metadata: submissionData.metadata,
            status: 'submitted'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
      }

      setSubmitStatus('success');
      setFormData({});
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormComponent = (component: FormComponent) => {
    const { id, type, label, props = {} } = component;
    const isRequired = props.required || false;
    const placeholder = props.placeholder || '';
    const componentDescription = props.description || '';
    const options = props.options || [];
    const value = formData[id] || '';
    const hasError = !!errors[id];

    const labelElement = (
      <Label className={`text-sm font-medium ${hasError ? 'text-red-700' : 'text-gray-700'}`}>
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
        {componentDescription && (
          <span className="text-xs text-gray-500 font-normal block mt-1">
            {componentDescription}
          </span>
        )}
      </Label>
    );

    const errorElement = hasError && (
      <span className="text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        {errors[id]}
      </span>
    );

    switch (type) {
      case 'text_input':
        return (
          <div key={id} className="space-y-2">
            {labelElement}
            <Input 
              value={value}
              onChange={(e) => updateFormData(id, e.target.value)}
              placeholder={placeholder}
              className={hasError ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errorElement}
          </div>
        );

      case 'textarea':
        return (
          <div key={id} className="space-y-2">
            {labelElement}
            <Textarea 
              value={value}
              onChange={(e) => updateFormData(id, e.target.value)}
              placeholder={placeholder}
              className={`min-h-[100px] ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errorElement}
          </div>
        );

      case 'select':
        return (
          <div key={id} className="space-y-2">
            {labelElement}
            <select
              value={value}
              onChange={(e) => updateFormData(id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">{placeholder || "Select an option..."}</option>
              {options.map((option: string, index: number) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errorElement}
          </div>
        );

      case 'radio':
        return (
          <div key={id} className="space-y-3">
            {labelElement}
            <div className="space-y-2">
              {options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={option}
                    checked={value === option}
                    onChange={(e) => updateFormData(id, e.target.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <Label className="text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </div>
            {errorElement}
          </div>
        );

      case 'checkbox':
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <div key={id} className="space-y-3">
            {labelElement}
            <div className="space-y-2">
              {options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={checkboxValues.includes(option)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...checkboxValues, option]
                        : checkboxValues.filter((v: string) => v !== option);
                      updateFormData(id, newValues);
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label className="text-sm text-gray-700">{option}</Label>
                </div>
              ))}
            </div>
            {errorElement}
          </div>
        );

      case 'date':
        return (
          <div key={id} className="space-y-2">
            {labelElement}
            <div className="relative">
              <Input 
                type="date"
                value={value}
                onChange={(e) => updateFormData(id, e.target.value)}
                className={hasError ? 'border-red-500 focus:border-red-500' : ''}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errorElement}
          </div>
        );

      case 'number':
        return (
          <div key={id} className="space-y-2">
            {labelElement}
            <Input 
              type="number"
              value={value}
              onChange={(e) => updateFormData(id, e.target.value)}
              placeholder={placeholder}
              min={props.min}
              max={props.max}
              className={hasError ? 'border-red-500 focus:border-red-500' : ''}
            />
            {(props.min !== undefined || props.max !== undefined) && (
              <div className="text-xs text-gray-500">
                Range: {props.min || 0} - {props.max || '∞'}
              </div>
            )}
            {errorElement}
          </div>
        );

      case 'scale':
        return (
          <div key={id} className="space-y-3">
            {labelElement}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{props.min || 1}</span>
                <span className="text-sm text-gray-500">{props.max || 10}</span>
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: (props.max || 10) - (props.min || 1) + 1 }, (_, i) => {
                  const scaleValue = (props.min || 1) + i;
                  return (
                    <button
                      key={scaleValue}
                      type="button"
                      onClick={() => updateFormData(id, scaleValue)}
                      className={`w-8 h-8 rounded-full border-2 text-sm flex items-center justify-center transition-colors ${
                        value === scaleValue
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300'
                      }`}
                    >
                      {scaleValue}
                    </button>
                  );
                })}
              </div>
            </div>
            {errorElement}
          </div>
        );

      case 'title_subtitle':
        return (
          <div key={id}>
            <TitleElement
              component={component}
              isEditing={false}
            />
          </div>
        );
      case 'subtitle':
        return (
          <div key={id}>
            <SubtitleElement
              props={{
                text: (props as any).text || label || 'Subtitle',
                level: (props as any).level || 'h3',
                fontFamily: (props as any).fontFamily || 'system',
                fontSize: (props as any).fontSize || 'lg',
                fontWeight: (props as any).fontWeight || 'medium',
                color: (props as any).color || '#6B7280',
                alignment: (props as any).alignment || 'left',
                marginTop: (props as any).marginTop || 8,
                marginBottom: (props as any).marginBottom || 12,
                enableMarkdown: (props as any).enableMarkdown || false
              }}
              isSelected={false}
            />
          </div>
        );

      case 'line_separator':
        return (
          <div key={id}>
            <SeparatorElement
              props={{
                style: (props as any).style || 'solid',
                thickness: (props as any).thickness || 1,
                color: (props as any).color || '#E5E7EB',
                width: (props as any).width || 100,
                marginTop: (props as any).marginTop || 16,
                marginBottom: (props as any).marginBottom || 16
              }}
              isSelected={false}
            />
          </div>
        );

      case 'ai_summary':
        return (
          <div key={id}>
            <AISummaryElement
              component={component}
              isEditing={false}
              allComponents={visibleComponents}
              onUpdate={(updates) => updateComponentData(id, updates)}
            />
          </div>
        );

      case 'evaluation_section': {
        const evaluationSections = evaluationSectionsConfig.evaluationSections;
        const section = evaluationSections.find((s: any) => s.id === (component as any).sectionId);
        
        if (!section) {
          return (
            <div key={id} className="p-4 border border-red-300 rounded bg-red-50">
              <p className="text-sm text-red-600">
                Evaluation section not found: {(component as any).sectionId}
              </p>
            </div>
          );
        }

        return (
          <div key={id} className="space-y-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-900">{label}</h3>
              <Badge variant="outline" className="text-xs">{section.discipline}</Badge>
            </div>
            
            {section.description && (
              <p className="text-sm text-gray-600">{section.description}</p>
            )}
            
            <div className="space-y-3 mt-4">
              {section.fields.map((field: any, fieldIndex: number) => {
                const fieldId = `${id}_${field.id}`;
                const fieldValue = formData[fieldId] || '';
                
                // Render each field based on its type
                switch (field.type) {
                  case 'section_header':
                    return (
                      <div key={fieldIndex} className={`mt-${field.level === 1 ? '4' : '3'} mb-2`}>
                        <h4 className={`text-${field.level === 1 ? 'lg' : 'md'} font-semibold text-gray-800`}>{field.label}</h4>
                      </div>
                    );
                    
                  case 'text':
                    return (
                      <div key={fieldIndex} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <Input
                          value={fieldValue}
                          onChange={(e) => updateFormData(fieldId, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className="text-sm"
                        />
                      </div>
                    );
                    
                  case 'textarea':
                    return (
                      <div key={fieldIndex} className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <Textarea
                          value={fieldValue}
                          onChange={(e) => updateFormData(fieldId, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          rows={field.rows || 3}
                          className="text-sm"
                        />
                      </div>
                    );
                    
                  default:
                    return (
                      <div key={fieldIndex} className="text-sm text-gray-500">
                        {field.label} ({field.type})
                      </div>
                    );
                }
              })}
            </div>
          </div>
        );
      }

      default:
        return (
          <div key={id} className="space-y-2">
            <Label className="text-sm text-gray-500">Unknown Component Type: {type}</Label>
          </div>
        );
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {template.name || 'Untitled Form'}
              </h2>
              {template.description && (
                <p className="text-gray-600">
                  {template.description}
                </p>
              )}
              
              {/* Progress bar for multi-page forms */}
              {isMultiPage && pages.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Page {currentPageIndex + 1} of {pages.length}: {pages[currentPageIndex]?.title || 'Untitled Page'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(((currentPageIndex + 1) / pages.length) * 100)}% Complete
                    </span>
                  </div>
                  <Progress
                    value={((currentPageIndex + 1) / pages.length) * 100}
                    className="h-2"
                  />
                  {pages[currentPageIndex]?.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {pages[currentPageIndex].description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Form submitted successfully!
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === 'error' && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  There was an error submitting the form. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Form Fields */}
            {visibleComponents.length > 0 ? (
              <div className="space-y-6">
                {visibleComponents.map(renderFormComponent)}
                
                {/* Navigation and Submit Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    {isMultiPage ? (
                      <>
                        <Button
                          type="button"
                          onClick={handlePreviousPage}
                          disabled={currentPageIndex === 0}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          {Array.from({ length: pages.length }, (_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full transition-colors ${
                                i === currentPageIndex
                                  ? 'bg-blue-600'
                                  : i < currentPageIndex
                                  ? 'bg-blue-300'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        
                        {currentPageIndex === pages.length - 1 ? (
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Form'}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={handleNextPage}
                            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Form'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <AlertCircle className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  No form fields
                </h3>
                <p className="text-gray-400">
                  This form doesn't have any fields configured yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};