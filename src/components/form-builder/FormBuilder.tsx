import * as React from "react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Save, Settings, Eye, Plus, Trash2, GripVertical, Cloud, CloudOff, Loader2, 
  Sparkles, Users, Clock, Tag, Palette, Share2, Search, Download, 
  Calendar, Star, Shield, Grid, List, AlertCircle, Lock 
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  MeasuringStrategy,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";

// Local imports
import { ComponentPalette } from "./ComponentPalette";
import { FormPreview } from "./FormPreview";
import { EvaluationSectionsModule } from "./EvaluationSectionsModule";
import { ClinicalComponentPalette } from "./ClinicalComponentPalette";
import { ConditionalLogicPanel } from "./ConditionalLogicPanel";
import { ComponentRenderer } from "./ComponentRenderer";
import { FormSummary } from "./FormSummary";
import { createFormTemplate, updateFormTemplate, getFormTemplates, type TemplateSearchParams } from "@/lib/api-form-builder";
import type { FormTemplate, FormComponent } from "@/lib/api-form-builder";
import type { FormPage } from "@/lib/schemas/api-validation";
import { useFormAutosave } from "@/hooks/useFormAutosave";
import { useFormLock } from "@/hooks/useFormLock";
import { Alert, AlertDescription } from "@/components/ui/alert";

const templateFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  clinical_context: z.string().min(2, "Clinical context is required"),
  tags: z.string().optional(),
  targetAudience: z.array(z.string()).optional(),
  estimatedCompletionTime: z.number().min(1).max(180).optional(),
  showIplcLogo: z.boolean(),
  logoPosition: z.enum(['top-left', 'top-right', 'top-center']),
  primaryColor: z.string().optional(),
  fontFamily: z.string().optional(),
  isPublic: z.boolean(),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

interface FormBuilderProps {
  apiToken?: string;
  template?: FormTemplate;
  onSave?: (template: FormTemplate) => void;
  mode?: 'create' | 'edit';
}

// Sortable Item Component
interface SortableItemProps {
  id: string;
  component: FormComponent;
  index: number;
  isSelected: boolean;
  onRemove: () => void;
  onUpdate: (updates: Partial<FormComponent>) => void;
  onClick: () => void;
  allComponents: FormComponent[];
  isEditing: boolean;
}

function SortableItem({ 
  id, 
  component, 
  index, 
  isSelected, 
  onRemove, 
  onUpdate, 
  onClick,
  allComponents,
  isEditing 
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: !isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border rounded-lg p-4 bg-white ${
        isDragging ? "z-50 shadow-lg" :
        isSelected ? "border-blue-500 bg-blue-50/50" : "border-gray-200"
      } transition-all duration-200 cursor-pointer`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Form component: ${component.label || component.type}`}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Remove component"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div 
            className="drag-handle cursor-move p-2 hover:bg-gradient-metallic-primary hover:text-white rounded-md shadow-sm border border-gray-200"
            style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="pr-16">
        <ComponentRenderer
          component={component}
          onUpdate={onUpdate}
          isEditing={isEditing}
          allComponents={allComponents}
        />
      </div>
      
      {isSelected && component.type !== 'title_subtitle' && component.type !== 'line_separator' && component.type !== 'evaluation_section' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <ConditionalLogicPanel
            component={component}
            allComponents={allComponents}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </div>
  );
}

export function FormBuilder({ apiToken = '', template, onSave, mode = 'create' }: FormBuilderProps) {
  // Multi-page form state
  const [isMultiPage, setIsMultiPage] = useState(template?.schema?.isMultiPage || false);
  const [pages, setPages] = useState<FormPage[]>(() => {
    if (template?.schema?.pages && template.schema.pages.length > 0) {
      return template.schema.pages;
    }
    return [{
      id: 'page_1',
      title: 'Page 1',
      description: '',
      order: 0,
      components: template?.schema?.components || []
    }];
  });
  const [activePageId, setActivePageId] = useState<string>(pages[0]?.id || 'page_1');
  
  const currentPage = pages.find(p => p.id === activePageId);
  const components = currentPage?.components || [];
  
  const setComponents = useCallback((newComponents: FormComponent[]) => {
    setPages(prevPages =>
      prevPages.map(page =>
        page.id === activePageId
          ? { ...page, components: newComponents }
          : page
      )
    );
  }, [activePageId]);
  
  const [previewMode, setPreviewMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loadTemplateOpen, setLoadTemplateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'evaluation' | 'clinical'>('components');
  const [selectedComponentIndex, setSelectedComponentIndex] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  
  // DnD state
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  
  // Load Template state
  const [availableTemplates, setAvailableTemplates] = useState<FormTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'updated_at' | 'usage_count' | 'rating'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Configure dnd-kit sensors with accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Session ID for autosave
  const sessionId = useMemo(() => {
    if (template?.id) {
      return `form_${template.id}_${Date.now()}`;
    }
    return `form_new_${Date.now()}`;
  }, [template?.id]);
  
  const userId = "1";
  const userName = "User";
  
  // Form locking
  const {
    status: lockStatus,
    acquireLock,
  } = useFormLock({
    formId: template?.id?.toString() || 'new',
    userId,
    userName,
    onLockAcquired: () => {
      console.log('Form lock acquired');
    },
    onLockFailed: (lockedBy) => {
      console.log(`Form is locked by ${lockedBy}`);
    }
  });
  
  // Initialize autosave
  const { save: autoSave, status: saveStatus, deleteSession } = useFormAutosave({
    sessionId,
    formId: template?.id?.toString() || 'new',
    userId,
    userName,
    onSaveSuccess: () => {
      console.log('Autosave successful');
    },
    onSaveError: (error) => {
      console.error('Autosave failed:', error);
    }
  });
  
  // Form setup
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: template?.name || "",
      description: template?.description || "",
      category: template?.category || "",
      subcategory: (template?.metadata as any)?.subcategory || "",
      clinical_context: template?.clinical_context || "",
      tags: (template?.metadata as any)?.tags?.join(', ') || "",
      targetAudience: (template?.metadata as any)?.targetAudience || [],
      estimatedCompletionTime: (template?.metadata as any)?.estimatedCompletionTime || 15,
      showIplcLogo: template?.metadata?.showIplcLogo ?? true,
      logoPosition: (template?.metadata as any)?.logoPosition || 'top-left',
      primaryColor: (template?.metadata as any)?.customStyling?.primaryColor || "#007bff",
      fontFamily: (template?.metadata as any)?.customStyling?.fontFamily || "system",
      isPublic: (template?.metadata as any)?.isPublic ?? false,
    },
  });
  
  // Autosave when components or pages change
  useEffect(() => {
    if (isMultiPage && pages.length > 0) {
      autoSave({
        components: [],
        pages,
        isMultiPage: true,
        metadata: {
          name: form.getValues("name"),
          description: form.getValues("description"),
          category: form.getValues("category"),
          clinical_context: form.getValues("clinical_context"),
          showIplcLogo: form.getValues("showIplcLogo"),
        }
      });
    } else if (!isMultiPage && components.length > 0) {
      autoSave({
        components,
        pages: [],
        isMultiPage: false,
        metadata: {
          name: form.getValues("name"),
          description: form.getValues("description"),
          category: form.getValues("category"),
          clinical_context: form.getValues("clinical_context"),
          showIplcLogo: form.getValues("showIplcLogo"),
        }
      });
    }
  }, [components, pages, isMultiPage, autoSave, form]);
  
  // iOS keyboard handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };
    
    const handleResize = () => {
      if (window.visualViewport) {
        const viewport = window.visualViewport;
        document.documentElement.style.setProperty(
          '--viewport-height',
          `${viewport.height}px`
        );
      }
    };
    
    document.addEventListener('focusin', handleFocusIn);
    window.visualViewport?.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  // Page management functions
  const addPage = useCallback(() => {
    const newPageId = `page_${Date.now()}`;
    const newPage: FormPage = {
      id: newPageId,
      title: `Page ${pages.length + 1}`,
      description: '',
      order: pages.length,
      components: []
    };
    setPages([...pages, newPage]);
    setActivePageId(newPageId);
  }, [pages]);
  
  const removePage = useCallback((pageId: string) => {
    if (pages.length <= 1) return;
    
    const pageIndex = pages.findIndex(p => p.id === pageId);
    const newPages = pages.filter(p => p.id !== pageId);
    
    newPages.forEach((page, index) => {
      page.order = index;
    });
    
    setPages(newPages);
    
    if (pageId === activePageId) {
      const newActiveIndex = Math.max(0, pageIndex - 1);
      setActivePageId(newPages[newActiveIndex].id);
    }
  }, [pages, activePageId]);

  // Component management
  const addComponent = useCallback((component: FormComponent, targetIndex?: number) => {
    const newComponents = [...components];
    const insertIndex = targetIndex !== undefined ? targetIndex : newComponents.length;
    
    const newComponent: FormComponent = {
      ...component,
      id: component.id || `${component.type}_${Date.now()}`,
      order: insertIndex,
    };

    newComponents.splice(insertIndex, 0, newComponent);
    
    newComponents.forEach((comp, index) => {
      comp.order = index;
    });

    setComponents(newComponents);
  }, [components, setComponents]);

  const handleComponentClick = useCallback((component: FormComponent) => {
    addComponent(component);
  }, [addComponent]);

  const removeComponent = useCallback((index: number) => {
    const newComponents = components.filter((_: FormComponent, i: number) => i !== index);
    newComponents.forEach((comp: FormComponent, i: number) => {
      comp.order = i;
    });
    setComponents(newComponents);
  }, [components, setComponents]);

  const updateComponent = useCallback((index: number, updates: Partial<FormComponent>) => {
    const newComponents = [...components];
    newComponents[index] = { ...newComponents[index], ...updates };
    setComponents(newComponents);
  }, [components, setComponents]);

  // DnD handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    if (typeof active.id === 'string' && active.id.startsWith('palette-')) {
      const componentData = active.data?.current as FormComponent;
      if (componentData) {
        const overIndex = components.findIndex(c => c.id === over.id);
        addComponent(componentData, overIndex >= 0 ? overIndex : undefined);
      }
    } else if (active.id !== over.id) {
      const oldIndex = components.findIndex(c => c.id === active.id);
      const newIndex = components.findIndex(c => c.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newComponents = arrayMove(components, oldIndex, newIndex);
        newComponents.forEach((comp, index) => {
          comp.order = index;
        });
        setComponents(newComponents);
      }
    }
    
    setActiveId(null);
    setOverId(null);
  };

  // Load templates
  const loadTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    try {
      const url = new URL(window.location.href);
      const searchParams: TemplateSearchParams = {
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        status: 'active',
        limit: 50,
      };

      const response = await getFormTemplates(url.origin, apiToken, searchParams);
      if (response.success) {
        setAvailableTemplates(response.templates);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setTemplatesLoading(false);
    }
  }, [apiToken, searchQuery, selectedCategory, selectedTags, sortBy, sortOrder]);

  useEffect(() => {
    if (loadTemplateOpen) {
      loadTemplates();
    }
  }, [loadTemplateOpen, loadTemplates]);

  // Form submission
  const onSubmit = async (data: TemplateFormValues) => {
    try {
      const url = new URL(window.location.href);
      
      const templateData = {
        name: data.name,
        description: data.description,
        category: data.category,
        clinical_context: data.clinical_context,
        schema: {
          components: isMultiPage ? [] : components,
          pages: isMultiPage ? pages : [],
          isMultiPage
        },
        metadata: {
          ...template?.metadata,
          showIplcLogo: data.showIplcLogo,
          logoPosition: data.logoPosition,
          primaryColor: data.primaryColor,
          fontFamily: data.fontFamily,
          isPublic: data.isPublic,
          subcategory: data.subcategory,
          tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean),
          targetAudience: data.targetAudience,
          estimatedCompletionTime: data.estimatedCompletionTime,
        },
        status: template?.status || 'draft',
        version: template ? template.version + 1 : 1,
        created_by: 1,
        updated_by: 1,
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

      if (response.success && response.template) {
        await deleteSession();
        if (onSave) {
          onSave(response.template);
        }
      }
      
      setSettingsOpen(false);
    } catch (error) {
      console.error("Error saving form template:", error);
    }
  };

  const activeComponent = activeId 
    ? components.find(c => c.id === activeId) 
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
    >
      <div className="form-builder-container flex h-screen bg-background">
        {/* Component Palette Sidebar */}
        <div className="relative flex-shrink-0 transition-all duration-300 ease-in-out">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'components' | 'evaluation' | 'clinical')} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-metallic-primary">
              <TabsTrigger value="components" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Components
              </TabsTrigger>
              <TabsTrigger value="evaluation" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Evaluation
              </TabsTrigger>
              <TabsTrigger value="clinical" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Clinical
              </TabsTrigger>
            </TabsList>
            <TabsContent value="components" className="flex-1 mt-0 overflow-hidden">
              <ComponentPalette
                onComponentDrag={(component) => {
                  console.log('Component drag from palette', component);
                }}
                onComponentClick={handleComponentClick}
              />
            </TabsContent>
            <TabsContent value="evaluation" className="flex-1 mt-0 overflow-hidden">
              <EvaluationSectionsModule
                onSectionDrag={(component) => {
                  console.log('Section drag from palette', component);
                }}
                onComponentClick={handleComponentClick}
              />
            </TabsContent>
            <TabsContent value="clinical" className="flex-1 mt-0 overflow-hidden">
              <ClinicalComponentPalette
                onComponentDrag={(component) => {
                  console.log('Clinical component drag from palette', component);
                }}
                onComponentClick={handleComponentClick}
                selectedDiscipline="Both"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Lock Warning */}
          {lockStatus.isLocked && lockStatus.lockedBy !== userName && (
            <Alert className="m-4 border-yellow-500 bg-yellow-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>
                    This form is currently being edited by <strong>{lockStatus.lockedBy}</strong>.
                  </span>
                </div>
                {lockStatus.canTakeover && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acquireLock(true)}
                  >
                    Take Over
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Toolbar */}
          <div className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">
                  {template ? `Edit: ${template.name}` : "New Form Template"}
                </h2>
                
                {/* Autosave Status */}
                <div className="flex items-center gap-2 text-sm">
                  {saveStatus.saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Saving...</span>
                    </>
                  ) : saveStatus.lastSaved ? (
                    <>
                      <Cloud className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">
                        Saved {new Date(saveStatus.lastSaved).toLocaleTimeString()}
                      </span>
                    </>
                  ) : saveStatus.error ? (
                    <>
                      <CloudOff className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">Save failed</span>
                    </>
                  ) : null}
                </div>
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
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas Content */}
          <div className="flex-1 overflow-auto p-6">
            {previewMode ? (
              <FormPreview
                components={!isMultiPage ? components : undefined}
                pages={isMultiPage ? pages : undefined}
                isMultiPage={isMultiPage}
                title={form.getValues("name") || "Form Preview"}
                description={form.getValues("description")}
                showIplcLogo={form.getValues("showIplcLogo")}
              />
            ) : (
              <div
                className={`min-h-full bg-white rounded-lg border-2 border-dashed ${
                  overId ? 'border-primary bg-primary/5' : 'border-gray-300'
                } p-6 transition-colors duration-200`}
              >
                {components.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <Plus className="h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">Start building your form</p>
                    <p className="text-sm">Drag components from the palette or click to add</p>
                  </div>
                ) : (
                  <SortableContext
                    items={components.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {components.map((component: FormComponent, index: number) => (
                        <SortableItem
                          key={component.id}
                          id={component.id}
                          component={component}
                          index={index}
                          isSelected={selectedComponentIndex === index}
                          onRemove={() => removeComponent(index)}
                          onUpdate={(updates) => updateComponent(index, updates)}
                          onClick={() => setSelectedComponentIndex(index === selectedComponentIndex ? null : index)}
                          allComponents={components}
                          isEditing={!previewMode}
                        />
                      ))}
                    </div>
                  </SortableContext>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeComponent ? (
            <div className="bg-white border-2 border-primary rounded-lg p-4 shadow-lg opacity-90">
              <ComponentRenderer
                component={activeComponent}
                isEditing={false}
                allComponents={[]}
              />
            </div>
          ) : null}
        </DragOverlay>
        
        {/* Settings Dialog - Simplified for now */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Save Template</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter template name" {...field} />
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
                        <Textarea placeholder="Enter template description" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="assessment">Assessment</SelectItem>
                          <SelectItem value="treatment">Treatment</SelectItem>
                          <SelectItem value="progress">Progress Notes</SelectItem>
                          <SelectItem value="evaluation">Evaluation</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input placeholder="e.g., Speech Therapy, Occupational Therapy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSettingsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Template
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* AI Summary Modal */}
        <FormSummary
          formId={template?.id?.toString() || 'new'}
          formName={form.getValues("name") || "Untitled Form"}
          formDescription={form.getValues("description")}
          components={components}
          isOpen={showSummary}
          onClose={() => setShowSummary(false)}
        />
      </div>
    </DndContext>
  );
}