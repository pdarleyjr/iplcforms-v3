import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { FormComponent } from "@/lib/api-form-builder";

interface FieldSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  allComponents: FormComponent[];
  formData: Record<string, any>;
  preselectedFields?: string[];
  onConfirm: (selectedFields: string[], fieldData: Record<string, any>) => void;
}

export const FieldSelectorDialog: React.FC<FieldSelectorDialogProps> = ({
  isOpen,
  onClose,
  allComponents,
  formData,
  preselectedFields = [],
  onConfirm,
}) => {
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(preselectedFields)
  );

  // Filter out AI summary components and empty fields
  const selectableFields = useMemo(() => {
    return allComponents.filter(component => {
      // Exclude AI summary components
      if (component.type === 'ai_summary') return false;
      
      // Exclude fields with no data
      const fieldValue = formData[component.id];
      if (fieldValue === undefined || fieldValue === null || fieldValue === '') return false;
      
      // For arrays, check if empty
      if (Array.isArray(fieldValue) && fieldValue.length === 0) return false;
      
      return true;
    });
  }, [allComponents, formData]);

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId);
      } else {
        newSet.add(fieldId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedFields(new Set(selectableFields.map(f => f.id)));
  };

  const handleDeselectAll = () => {
    setSelectedFields(new Set());
  };

  const handleConfirm = () => {
    const selectedFieldIds = Array.from(selectedFields);
    const selectedFieldData: Record<string, any> = {};
    
    selectedFieldIds.forEach(fieldId => {
      selectedFieldData[fieldId] = formData[fieldId];
    });
    
    onConfirm(selectedFieldIds, selectedFieldData);
  };

  const getFieldPreview = (component: FormComponent) => {
    const value = formData[component.id];
    
    if (value === null || value === undefined) return '';
    
    // Handle different field types
    switch (component.type) {
      case 'checkbox':
        return Array.isArray(value) ? value.join(', ') : value.toString();
      case 'select':
      case 'radio':
        return value.toString();
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'number':
      case 'scale':
        return value.toString();
      case 'text_input':
      case 'textarea':
        return value.length > 50 ? `${value.substring(0, 50)}...` : value;
      default:
        // For complex clinical components, show a summary
        if (typeof value === 'object') {
          return 'Complex data';
        }
        return value.toString();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Fields for AI Summary</DialogTitle>
          <DialogDescription>
            Choose which form fields should be included in the AI-generated summary.
            Only fields with data are shown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {selectedFields.size} of {selectableFields.length} fields selected
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={selectedFields.size === selectableFields.length}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeselectAll}
                disabled={selectedFields.size === 0}
              >
                Deselect All
              </Button>
            </div>
          </div>

          {selectableFields.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No fields with data available. Please fill out some form fields before generating a summary.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="h-[400px] rounded-md border p-4 overflow-y-auto">
              <div className="space-y-4">
                {selectableFields.map((component) => {
                  const isSelected = selectedFields.has(component.id);
                  const preview = getFieldPreview(component);
                  
                  return (
                    <div
                      key={component.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={component.id}
                        checked={isSelected}
                        onCheckedChange={() => handleFieldToggle(component.id)}
                      />
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor={component.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {component.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Type: {component.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        {preview && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Preview: {preview}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedFields.size === 0}
          >
            Generate Summary ({selectedFields.size} field{selectedFields.size !== 1 ? 's' : ''})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FieldSelectorDialog;