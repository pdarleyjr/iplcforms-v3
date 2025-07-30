import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Trash2, GitBranch } from 'lucide-react';
import type { FormComponent } from '@/lib/api-form-builder';

interface ConditionalLogicPanelProps {
  component: FormComponent;
  allComponents: FormComponent[];
  onUpdate: (updates: Partial<FormComponent>) => void;
}

export function ConditionalLogicPanel({ component, allComponents, onUpdate }: ConditionalLogicPanelProps) {
  // Filter out the current component and non-field components
  const availableFields = allComponents.filter(
    c => c.id !== component.id && 
    !['title_subtitle', 'line_separator', 'evaluation_section', 'ai_summary'].includes(c.type)
  );

  const visibilityCondition = component.props?.visibilityCondition;
  const hasCondition = !!visibilityCondition;

  const handleToggleConditional = (enabled: boolean) => {
    if (enabled) {
      // Initialize with default condition
      onUpdate({
        props: {
          ...component.props,
          visibilityCondition: {
            field: availableFields[0]?.id || '',
            operator: 'equals',
            value: ''
          }
        }
      });
    } else {
      // Remove visibilityCondition
      const { visibilityCondition, ...restProps } = component.props || {};
      onUpdate({
        props: restProps
      });
    }
  };

  const handleFieldChange = (field: string) => {
    onUpdate({
      props: {
        ...component.props,
        visibilityCondition: {
          ...visibilityCondition,
          field,
          value: '' // Reset value when field changes
        }
      }
    });
  };

  const handleOperatorChange = (operator: string) => {
    onUpdate({
      props: {
        ...component.props,
        visibilityCondition: {
          ...visibilityCondition,
          operator
        }
      }
    });
  };

  const handleValueChange = (value: string) => {
    onUpdate({
      props: {
        ...component.props,
        visibilityCondition: {
          ...visibilityCondition,
          value
        }
      }
    });
  };

  // Get the selected trigger field for value hints
  const triggerField = availableFields.find(f => f.id === visibilityCondition?.field);

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-medium">Conditional Logic</CardTitle>
          </div>
          <Switch
            checked={hasCondition}
            onCheckedChange={handleToggleConditional}
          />
        </div>
      </CardHeader>
      
      {hasCondition && (
        <CardContent className="px-0 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Show this field when:</Label>
            
            {/* Field Selection */}
            <div className="space-y-2">
              <Select
                value={visibilityCondition.field}
                onValueChange={handleFieldChange}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.label || field.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Operator Selection */}
            <div className="space-y-2">
              <Select
                value={visibilityCondition.operator}
                onValueChange={handleOperatorChange}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Does not equal</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater_than">Greater than</SelectItem>
                  <SelectItem value="less_than">Less than</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Value Input */}
            <div className="space-y-2">
              {triggerField?.type === 'select' || triggerField?.type === 'radio' ? (
                <Select
                  value={visibilityCondition.value}
                  onValueChange={handleValueChange}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerField.props?.options?.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : triggerField?.type === 'checkbox' ? (
                <Select
                  value={visibilityCondition.value}
                  onValueChange={handleValueChange}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Checked</SelectItem>
                    <SelectItem value="false">Unchecked</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={visibilityCondition.value}
                  onChange={(e) => handleValueChange(e.target.value)}
                  placeholder={
                    triggerField?.type === 'number' ? 'Enter number' :
                    triggerField?.type === 'date' ? 'YYYY-MM-DD' :
                    'Enter value'
                  }
                  type={triggerField?.type === 'number' ? 'number' : 'text'}
                  className="h-9"
                />
              )}
            </div>
          </div>

          {/* Condition Preview */}
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Preview:</span> Show when{' '}
              <span className="font-mono bg-blue-100 px-1 rounded">
                {triggerField?.label || 'field'}
              </span>{' '}
              {visibilityCondition.operator === 'equals' && 'equals'}
              {visibilityCondition.operator === 'not_equals' && 'does not equal'}
              {visibilityCondition.operator === 'contains' && 'contains'}
              {visibilityCondition.operator === 'greater_than' && 'is greater than'}
              {visibilityCondition.operator === 'less_than' && 'is less than'}{' '}
              <span className="font-mono bg-blue-100 px-1 rounded">
                {visibilityCondition.value || '...'}
              </span>
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}