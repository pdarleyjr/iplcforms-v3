// Form Preview Component for Form Builder - IPLC Forms v3
// Live preview of form being built

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FormComponent } from '@/lib/api-form-builder';
import { Calendar, Eye } from 'lucide-react';
import { AISummaryElement } from './components/AISummaryElement';
import { TitleElement } from './components/TitleElement';
import SubtitleElement from './components/SubtitleElement';
import SeparatorElement from './components/SeparatorElement';
import evaluationSectionsConfig from './evaluation-sections-config.json';

interface FormPreviewProps {
  components: FormComponent[];
  title: string;
  description?: string;
  className?: string;
  showIplcLogo?: boolean; // New prop
}

// LogoHeader component for conditional IPLC logo rendering
const LogoHeader: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-200">
      <div className="text-2xl font-bold">
        FormPro
      </div>
      <div className="text-xs text-gray-400">
        Form powered by IPLC
      </div>
    </div>
  );
};

export const FormPreview: React.FC<FormPreviewProps> = ({
  components,
  title,
  description = '',
  className = '',
  showIplcLogo
}) => {
  // Sort components by order
  const sortedComponents = [...components].sort((a, b) => a.order - b.order);

  const renderPreviewComponent = (component: FormComponent) => {
    const { type, label, props = {} } = component;
    const isRequired = props.required || false;
    const placeholder = props.placeholder || '';
    const componentDescription = props.description || '';
    const options = props.options || [];

    const labelElement = (
      <Label className="text-sm font-medium text-gray-700">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
        {componentDescription && (
          <span className="text-xs text-gray-500 font-normal block mt-1">
            {componentDescription}
          </span>
        )}
      </Label>
    );

    switch (type) {
      case 'text_input':
        return (
          <div key={component.id} className="space-y-2">
            {labelElement}
            <Input 
              placeholder={placeholder}
              disabled
              className="bg-gray-50"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={component.id} className="space-y-2">
            {labelElement}
            <Textarea 
              placeholder={placeholder}
              disabled
              className="bg-gray-50 min-h-[100px]"
            />
          </div>
        );

      case 'select':
        return (
          <div key={component.id} className="space-y-2">
            {labelElement}
            <select
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{placeholder || "Select an option..."}</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div key={component.id} className="space-y-3">
            {labelElement}
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={option}
                    disabled
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <Label className="text-sm text-gray-600">{option}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={component.id} className="space-y-3">
            {labelElement}
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label className="text-sm text-gray-600">{option}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={component.id} className="space-y-2">
            {labelElement}
            <div className="relative">
              <Input 
                type="date"
                disabled
                className="bg-gray-50"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={component.id} className="space-y-2">
            {labelElement}
            <Input 
              type="number"
              placeholder={placeholder}
              min={props.min}
              max={props.max}
              disabled
              className="bg-gray-50"
            />
            {(props.min !== undefined || props.max !== undefined) && (
              <div className="text-xs text-gray-500">
                Range: {props.min || 0} - {props.max || '∞'}
              </div>
            )}
          </div>
        );

      case 'scale':
        return (
          <div key={component.id} className="space-y-3">
            {labelElement}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{props.min || 1}</span>
                <span className="text-sm text-gray-500">{props.max || 10}</span>
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: (props.max || 10) - (props.min || 1) + 1 }, (_, i) => {
                  const value = (props.min || 1) + i;
                  return (
                    <button
                      key={value}
                      disabled
                      className="w-8 h-8 rounded-full border-2 border-gray-300 bg-gray-50 text-sm text-gray-600 flex items-center justify-center font-medium shadow-sm"
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'ai_summary':
        return (
          <div key={component.id}>
            <AISummaryElement
              component={component}
              isEditing={false}
              allComponents={components}
            />
          </div>
        );

      case 'title_subtitle':
        return <TitleElement key={component.id} component={component} />;

      case 'subtitle':
        return <SubtitleElement key={component.id} props={component.props as any} />;

      case 'line_separator':
        return <SeparatorElement key={component.id} props={component.props as any} />;

      case 'evaluation_section': {
        const evaluationSections = evaluationSectionsConfig.evaluationSections;
        const section = evaluationSections.find((s: any) => s.id === (component as any).sectionId);
        
        if (!section) {
          return (
            <div key={component.id} className="p-4 border border-red-300 rounded bg-red-50">
              <p className="text-sm text-red-600">
                Evaluation section not found: {(component as any).sectionId}
              </p>
            </div>
          );
        }

        return (
          <div key={component.id} className="space-y-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-900">{component.label}</h3>
              <Badge variant="outline" className="text-xs">{section.discipline}</Badge>
            </div>
            
            {section.description && (
              <p className="text-sm text-gray-600">{section.description}</p>
            )}
            
            <div className="text-sm text-blue-700 italic">
              This evaluation section contains {section.fields.length} fields that will be displayed in the live form.
            </div>
          </div>
        );
      }

      default:
        return (
          <div key={component.id} className="space-y-2">
            <Label className="text-sm text-gray-500">Unknown Component Type: {type}</Label>
          </div>
        );
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg h-full overflow-y-auto ${className}`}>
      {/* Preview Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Preview</span>
          <Badge variant="secondary" className="text-xs">
            {sortedComponents.length} {sortedComponents.length === 1 ? 'field' : 'fields'}
          </Badge>
        </div>
        <p className="text-xs text-gray-500">
          This is how your form will appear to users
        </p>
      </div>

      {/* Preview Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* IPLC Logo Header - NEW */}
          <LogoHeader show={showIplcLogo ?? true} />
          
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title || 'Untitled Form'}
            </h2>
            {description && (
              <p className="text-gray-600">
                {description}
              </p>
            )}
          </div>

          {/* Form Fields */}
          {sortedComponents.length > 0 ? (
            <div className="space-y-6">
              {sortedComponents.map(renderPreviewComponent)}
              
              {/* Submit Button Preview */}
              <div className="pt-6 border-t border-gray-200">
                <Button disabled className="bg-blue-600 hover:bg-blue-700">
                  Submit Form
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Eye className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                No components yet
              </h3>
              <p className="text-gray-400">
                Drag components from the palette to start building your form
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};