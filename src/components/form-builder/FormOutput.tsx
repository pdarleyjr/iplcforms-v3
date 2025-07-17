// Form Output Component for IPLC Forms v3
// Final form rendering for submissions, previews, and PDF generation

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FormComponent, FormTemplate } from '@/lib/api-form-builder';
import { Calendar, CheckCircle, FileText } from 'lucide-react';
import { AISummaryElement } from './components/AISummaryElement';

export interface FormOutputProps {
  template: FormTemplate;
  submissionData?: any;
  mode: 'preview' | 'submission' | 'pdf';
  className?: string;
}

// LogoHeader component for conditional IPLC logo rendering in outputs
const OutputLogoHeader: React.FC<{ show: boolean; mode: string }> = ({ show, mode }) => {
  if (!show) return null;
  
  return (
    <header className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
      <div className="text-2xl font-bold">
        FormPro
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-2">
        {mode === 'submission' && (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Submitted</span>
          </div>
        )}
        {mode === 'pdf' && (
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>PDF Export</span>
          </div>
        )}
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </header>
  );
};

export const FormOutput: React.FC<FormOutputProps> = ({ 
  template, 
  submissionData = {}, 
  mode,
  className = ''
}) => {
  // Get logo setting from template metadata, default to true
  const showLogo = template.metadata?.showIplcLogo ?? true;
  
  // Extract components from template
  const components = Array.isArray(template.schema?.components) ? template.schema.components :
                    typeof template.schema?.components === 'string' ? JSON.parse(template.schema.components) : [];
  
  // Sort components by order
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  const renderOutputComponent = (component: FormComponent) => {
    const { id, type, label, props = {} } = component;
    const isRequired = props.required || false;
    const placeholder = props.placeholder || '';
    const componentDescription = props.description || '';
    const options = props.options || [];
    const value = submissionData[id] || '';

    const labelElement = (
      <Label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
        {componentDescription && (
          <span className="text-xs text-gray-500 font-normal block mt-1">
            {componentDescription}
          </span>
        )}
      </Label>
    );

    const displayValue = (val: any) => {
      if (val === null || val === undefined || val === '') {
        return <span className="text-gray-400 italic">No response</span>;
      }
      return <span className="text-gray-900">{val}</span>;
    };

    switch (type) {
      case 'text_input':
        return (
          <div key={id} className="space-y-2 mb-6">
            {labelElement}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[40px]">
              {displayValue(value)}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div key={id} className="space-y-2 mb-6">
            {labelElement}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[100px] whitespace-pre-wrap">
              {displayValue(value)}
            </div>
          </div>
        );

      case 'select':
        return (
          <div key={id} className="space-y-2 mb-6">
            {labelElement}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              {displayValue(value)}
            </div>
          </div>
        );

      case 'radio':
        return (
          <div key={id} className="space-y-3 mb-6">
            {labelElement}
            <div className="space-y-2">
              {options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    value === option 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {value === option && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <Label className={`text-sm ${value === option ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <div key={id} className="space-y-3 mb-6">
            {labelElement}
            <div className="space-y-2">
              {options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    checkboxValues.includes(option) 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {checkboxValues.includes(option) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <Label className={`text-sm ${checkboxValues.includes(option) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'date':
        const displayDate = value ? new Date(value).toLocaleDateString() : '';
        return (
          <div key={id} className="space-y-2 mb-6">
            {labelElement}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              {displayValue(displayDate)}
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={id} className="space-y-2 mb-6">
            {labelElement}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              {displayValue(value)}
            </div>
            {(props.min !== undefined || props.max !== undefined) && (
              <div className="text-xs text-gray-500">
                Range: {props.min || 0} - {props.max || '∞'}
              </div>
            )}
          </div>
        );

      case 'scale':
        return (
          <div key={id} className="space-y-3 mb-6">
            {labelElement}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{props.min || 1}</span>
                <span className="text-sm text-gray-500">{props.max || 10}</span>
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: (props.max || 10) - (props.min || 1) + 1 }, (_, i) => {
                  const scaleValue = (props.min || 1) + i;
                  return (
                    <div
                      key={scaleValue}
                      className={`w-8 h-8 rounded-full border-2 text-sm flex items-center justify-center ${
                        value === scaleValue
                          ? 'border-blue-500 bg-blue-500 text-white font-medium'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {scaleValue}
                    </div>
                  );
                })}
              </div>
              {value && (
                <div className="text-sm text-gray-600">
                  Selected: <span className="font-medium">{value}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'ai_summary':
        return (
          <div key={id} className="mb-6">
            <AISummaryElement
              component={component}
              formData={submissionData}
              allComponents={sortedComponents}
              isLiveForm={false}
              isEditing={false}
            />
          </div>
        );

      default:
        return (
          <div key={id} className="space-y-2 mb-6">
            <Label className="text-sm text-gray-500">Unknown Component Type: {type}</Label>
            <div className="p-3 bg-gray-100 border border-gray-200 rounded-md">
              {displayValue(value)}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`bg-white min-h-screen ${className}`}>
      {/* Conditional Logo Header */}
      <OutputLogoHeader show={showLogo} mode={mode} />
      
      {/* Form Content */}
      <main className={showLogo ? "p-6" : "p-6 pt-8"}>
        <div className="max-w-4xl mx-auto">
          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {template.name || 'Untitled Form'}
              </h2>
              {mode === 'submission' && (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Submitted
                </Badge>
              )}
              {mode === 'pdf' && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  <FileText className="w-3 h-3 mr-1" />
                  PDF Export
                </Badge>
              )}
            </div>
            
            {template.description && (
              <p className="text-gray-600 text-lg">
                {template.description}
              </p>
            )}
            
            {mode === 'submission' && submissionData && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-sm font-medium text-green-800 mb-1">Submission Details</h3>
                <p className="text-xs text-green-700">
                  Submitted on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          {/* Form Content */}
          {sortedComponents.length > 0 ? (
            <div className="space-y-1">
              {sortedComponents.map(renderOutputComponent)}
              
              {/* Footer for mode-specific information */}
              {mode !== 'preview' && (
                <div className="pt-8 border-t border-gray-200 mt-8">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      {mode === 'submission' && 'Form submission completed successfully'}
                      {mode === 'pdf' && 'Generated for PDF export'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                No form content
              </h3>
              <p className="text-gray-400">
                This form doesn't have any fields configured.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};