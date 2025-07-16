// Live Form Renderer Component for IPLC Forms v3
// Handles actual form data collection and submission with AI Summary support

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { FormComponent, FormTemplate } from '@/lib/api-form-builder';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { AISummaryElement } from './components/AISummaryElement';

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

  // Extract components from template
  const components = Array.isArray(template.schema?.components) ? template.schema.components :
                    typeof template.schema?.components === 'string' ? JSON.parse(template.schema.components) : [];
  
  // Sort components by order
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    sortedComponents.forEach(component => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Collect AI summary data from components
      const aiSummaryData: Record<string, any> = {};
      sortedComponents.forEach(component => {
        if (component.type === 'ai_summary' && component.props?.aiSummaryData) {
          aiSummaryData[component.id] = component.props.aiSummaryData;
        }
      });

      const submissionData: FormSubmissionData = {
        template_id: template.id!,
        responses: {
          ...formData,
          ...aiSummaryData
        },
        metadata: {
          submitted_at: new Date().toISOString(),
          form_version: template.version,
          ai_summaries: Object.keys(aiSummaryData)
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

      case 'ai_summary':
        return (
          <div key={id}>
            <AISummaryElement
              component={component}
              isEditing={false}
              allComponents={sortedComponents}
              onUpdate={(updates) => updateComponentData(id, updates)}
            />
          </div>
        );

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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {template.name || 'Untitled Form'}
              </h1>
              {template.description && (
                <p className="text-gray-600">
                  {template.description}
                </p>
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
            {sortedComponents.length > 0 ? (
              <div className="space-y-6">
                {sortedComponents.map(renderFormComponent)}
                
                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Form'}
                  </Button>
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