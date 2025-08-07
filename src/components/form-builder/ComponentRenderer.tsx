import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { FormComponent } from "@/lib/api-form-builder";
import { AISummaryElement } from "./components/AISummaryElement";
import TitleElement from "./components/TitleElement";
import SubtitleElement from "./components/SubtitleElement";
import SeparatorElement from "./components/SeparatorElement";
import evaluationSectionsConfig from "./evaluation-sections-config.json";

// Component renderer for displaying and editing form components
export function ComponentRenderer({
  component,
  onUpdate,
  isEditing = false,
  allComponents = []
}: {
  component: FormComponent;
  onUpdate?: (updates: Partial<FormComponent>) => void;
  isEditing?: boolean;
  allComponents?: FormComponent[];
}) {
  // Debug logging for evaluation sections
  if (component.type === 'evaluation_section') {
    console.log('ComponentRenderer: Rendering evaluation section', component);
    console.log('Component sectionId:', (component as any).sectionId);
  }
  
  const handleLabelChange = (label: string) => {
    onUpdate?.({ label });
  };

  const handlePropsChange = (newProps: Record<string, any>) => {
    onUpdate?.({ props: { ...component.props, ...newProps } });
  };

  switch (component.type) {
    case "text_input":
      return (
        <div className="space-y-2">
          {isEditing ? (
            <Input
              value={component.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="font-medium border-dashed"
              placeholder="Enter field label"
            />
          ) : (
            <label className="text-sm font-medium">{component.label}</label>
          )}
          <Input
            placeholder={component.props?.placeholder || "Enter text..."}
            disabled={!isEditing}
            className={isEditing ? "bg-gray-50" : ""}
          />
          {component.props?.required && (
            <span className="text-xs text-red-500">* Required</span>
          )}
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-2">
          {isEditing ? (
            <Input
              value={component.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="font-medium border-dashed"
              placeholder="Enter field label"
            />
          ) : (
            <label className="text-sm font-medium">{component.label}</label>
          )}
          <Textarea
            placeholder={component.props?.placeholder || "Enter text..."}
            disabled={!isEditing}
            className={isEditing ? "bg-gray-50" : ""}
          />
          {component.props?.required && (
            <span className="text-xs text-red-500">* Required</span>
          )}
        </div>
      );

    case "select":
      return (
        <div className="space-y-2">
          {isEditing ? (
            <Input
              value={component.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="font-medium border-dashed"
              placeholder="Enter field label"
            />
          ) : (
            <label className="text-sm font-medium">{component.label}</label>
          )}
          <select
            disabled={!isEditing}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select an option...</option>
            {component.props?.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {component.props?.required && (
            <span className="text-xs text-red-500">* Required</span>
          )}
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {isEditing ? (
            <Input
              value={component.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="font-medium border-dashed"
              placeholder="Enter field label"
            />
          ) : (
            <label className="text-sm font-medium">{component.label}</label>
          )}
          <div className="space-y-2">
            {component.props?.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={component.id}
                  value={option}
                  disabled={!isEditing}
                  className="h-4 w-4"
                />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
          {component.props?.required && (
            <span className="text-xs text-red-500">* Required</span>
          )}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              disabled={!isEditing}
              className="h-4 w-4"
            />
            {isEditing ? (
              <Input
                value={component.label}
                onChange={(e) => handleLabelChange(e.target.value)}
                className="font-medium border-dashed flex-1"
                placeholder="Enter checkbox label"
              />
            ) : (
              <label className="text-sm font-medium">{component.label}</label>
            )}
          </div>
          {component.props?.required && (
            <span className="text-xs text-red-500">* Required</span>
          )}
        </div>
      );

    case "date":
      return (
        <div className="space-y-2">
          {isEditing ? (
            <Input
              value={component.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="font-medium border-dashed"
              placeholder="Enter field label"
            />
          ) : (
            <label className="text-sm font-medium">{component.label}</label>
          )}
          <Input
            type="date"
            disabled={!isEditing}
            className={isEditing ? "bg-gray-50" : ""}
          />
          {component.props?.required && (
            <span className="text-xs text-red-500">* Required</span>
          )}
        </div>
      );

    case "number":
      return (
        <div className="space-y-2">
          {isEditing ? (
            <Input
              value={component.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="font-medium border-dashed"
              placeholder="Enter field label"
            />
          ) : (
            <label className="text-sm font-medium">{component.label}</label>
          )}
          <Input
            type="number"
            placeholder={component.props?.placeholder || "Enter number..."}
            disabled={!isEditing}
            className={isEditing ? "bg-gray-50" : ""}
          />
          {component.props?.required && (
            <span className="text-xs text-red-500">* Required</span>
          )}
        </div>
      );

    case "scale":
      return (
        <div className="space-y-2">
          {isEditing ? (
            <Input
              value={component.label}
              onChange={(e) => handleLabelChange(e.target.value)}
              className="font-medium border-dashed"
              placeholder="Enter scale label"
            />
          ) : (
            <label className="text-sm font-medium">{component.label}</label>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {component.props?.min || 1}
            </span>
            <input
              type="range"
              min={component.props?.min || 1}
              max={component.props?.max || 10}
              disabled={!isEditing}
              className="flex-1"
            />
            <span className="text-xs text-gray-500">
              {component.props?.max || 10}
            </span>
          </div>
          {component.props?.required && (
            <span className="text-xs text-red-500">* Required</span>
          )}
        </div>
      );

    case "ai_summary":
      return (
        <AISummaryElement
          component={component}
          onUpdate={onUpdate}
          isEditing={isEditing}
          allComponents={allComponents}
        />
      );

    case "title_subtitle":
      return (
        <TitleElement
          component={component}
          onUpdate={onUpdate}
          isEditing={isEditing}
        />
      );

    case "subtitle":
      return (
        <SubtitleElement
          props={component.props as any}
          isSelected={isEditing}
          onPropsChange={(newProps) => onUpdate && onUpdate({ props: newProps })}
        />
      );

    case "line_separator":
      return (
        <SeparatorElement
          props={component.props as any}
          isSelected={isEditing}
          onPropsChange={(newProps) => onUpdate && onUpdate({ props: newProps })}
        />
      );

    case "evaluation_section": {
      // Import the evaluation sections config to render the fields
      const evaluationSections = evaluationSectionsConfig.evaluationSections;
      const section = evaluationSections.find((s: any) => s.id === component.sectionId);
      
      if (!section) {
        return (
          <div className="p-4 border border-red-300 rounded bg-red-50">
            <p className="text-sm text-red-600">
              Evaluation section not found: {component.sectionId}
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-900">{component.label}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{section.discipline}</Badge>
              {component.collapsed && (
                <Badge variant="secondary" className="text-xs">Collapsed</Badge>
              )}
            </div>
          </div>
          
          {section.description && (
            <p className="text-sm text-gray-600">{section.description}</p>
          )}
          
          <div className="space-y-3 mt-4">
            {section.fields.slice(0, 5).map((field: any, fieldIndex: number) => (
              <div key={fieldIndex} className="pl-4 border-l-2 border-blue-200">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">{field.label}</span>
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                  <div className="text-xs text-gray-500 mt-1">Type: {field.type}</div>
                </div>
              </div>
            ))}
            {section.fields.length > 5 && (
              <p className="text-xs text-gray-500 italic">
                ... and {section.fields.length - 5} more fields
              </p>
            )}
          </div>
          
          {isEditing && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                This evaluation section contains {section.fields.length} fields.
                Use the Property Grid to customize individual field properties.
              </p>
            </div>
          )}
        </div>
      );
    }

    default:
      return (
        <div className="p-4 border border-dashed border-gray-300 rounded">
          <p className="text-sm text-gray-500">
            Unknown component type: {component.type}
          </p>
        </div>
      );
  }
}