import * as React from "react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Settings, Eye, Plus, Trash2, GripVertical } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ComponentPalette } from "./ComponentPalette";
import { FormPreview } from "./FormPreview";
import { createFormTemplate, updateFormTemplate } from "@/lib/api-form-builder";
import type { FormTemplate, FormComponent } from "@/lib/api-form-builder";

const templateFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  clinical_context: z.string().min(2, "Clinical context is required"),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

interface FormBuilderProps {
  apiToken: string;
  template?: FormTemplate;
  onSave?: (template: FormTemplate) => void;
}

export function FormBuilder({ apiToken, template, onSave }: FormBuilderProps) {
  const [components, setComponents] = useState<FormComponent[]>(
    template?.schema?.components || []
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState<FormComponent | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: template?.name || "",
      description: template?.description || "",
      category: template?.category || "",
      clinical_context: template?.clinical_context || "",
    },
  });

  const handleDrop = useCallback((event: React.DragEvent, targetIndex?: number) => {
    event.preventDefault();
    
    if (!draggedComponent) return;

    const newComponents = [...components];
    const insertIndex = targetIndex !== undefined ? targetIndex : newComponents.length;
    
    // Add new component with unique ID
    const newComponent: FormComponent = {
      ...draggedComponent,
      id: `${draggedComponent.type}_${Date.now()}`,
      order: insertIndex,
    };

    newComponents.splice(insertIndex, 0, newComponent);
    
    // Update order for all components
    newComponents.forEach((comp, index) => {
      comp.order = index;
    });

    setComponents(newComponents);
    setDraggedComponent(null);
    setDragOverIndex(null);
  }, [draggedComponent, components]);

  const handleDragOver = useCallback((event: React.DragEvent, index: number) => {
    event.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const moveComponent = useCallback((fromIndex: number, toIndex: number) => {
    const newComponents = [...components];
    const [movedComponent] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, movedComponent);
    
    // Update order
    newComponents.forEach((comp, index) => {
      comp.order = index;
    });
    
    setComponents(newComponents);
  }, [components]);

  const removeComponent = useCallback((index: number) => {
    const newComponents = components.filter((_, i) => i !== index);
    newComponents.forEach((comp, i) => {
      comp.order = i;
    });
    setComponents(newComponents);
  }, [components]);

  const updateComponent = useCallback((index: number, updates: Partial<FormComponent>) => {
    const newComponents = [...components];
    newComponents[index] = { ...newComponents[index], ...updates };
    setComponents(newComponents);
  }, [components]);

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      const url = new URL(window.location.href);
      
      const templateData = {
        name: data.name,
        description: data.description,
        category: data.category,
        clinical_context: data.clinical_context,
        schema: { components },
        status: template?.status || 'draft',
        version: template ? template.version + 1 : 1,
        created_by: 1, // TODO: Get from auth context
        updated_by: 1, // TODO: Get from auth context
      };

      let response;
      if (template && template.id) {
        const templateId = typeof template.id === 'string' ? parseInt(template.id, 10) : Number(template.id);
        if (!isNaN(templateId)) {
          response = await updateFormTemplate(Number(templateId), url.origin, apiToken, templateData);
        } else {
          throw new Error('Invalid template ID');
        }
      } else {
        response = await createFormTemplate(url.origin, apiToken, templateData);
      }

      if (response.success && response.template && onSave) {
        onSave(response.template);
      }
      
      setSettingsOpen(false);
    } catch (error) {
      console.error("Error saving form template:", error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Component Palette Sidebar */}
      <div className="w-80 border-r bg-card">
        <ComponentPalette 
          onComponentDrag={setDraggedComponent}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {template ? `Edit: ${template.name}` : "New Form Template"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
              
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Form Template Settings</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter form name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter form description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                              >
                                <option value="assessment">Assessment</option>
                                <option value="intake">Intake</option>
                                <option value="treatment">Treatment</option>
                                <option value="outcome">Outcome</option>
                                <option value="other">Other</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clinical_context"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Clinical Context</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the clinical context and purpose"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button className="w-full" type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Template
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="flex-1 overflow-auto p-6">
          {previewMode ? (
            <FormPreview 
              components={components}
              title={form.getValues("name") || "Form Preview"}
            />
          ) : (
            <div
              className="min-h-full bg-white rounded-lg border-2 border-dashed border-gray-300 p-6"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {components.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Plus className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">Start building your form</p>
                  <p className="text-sm">Drag components from the palette to begin</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {components.map((component, index) => (
                    <div
                      key={component.id}
                      className={`relative group border rounded-lg p-4 bg-white ${
                        dragOverIndex === index ? "border-primary bg-primary/5" : "border-gray-200"
                      }`}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      {/* Component Controls */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeComponent(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <div className="cursor-move">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Component Content */}
                      <div className="pr-16">
                        <ComponentRenderer
                          component={component}
                          onUpdate={(updates) => updateComponent(index, updates)}
                          isEditing={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component renderer for displaying and editing form components
function ComponentRenderer({ 
  component, 
  onUpdate, 
  isEditing = false 
}: { 
  component: FormComponent; 
  onUpdate?: (updates: Partial<FormComponent>) => void;
  isEditing?: boolean;
}) {
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