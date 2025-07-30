import * as React from "react";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Settings, Eye, Plus, Trash2, GripVertical, Cloud, CloudOff, Loader2, Sparkles, Users, Clock, Tag, Palette, Share2, FolderPlus, Search, Filter, Grid, List, Download, Calendar, Star, ChevronDown, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Sortable from "sortablejs";
import { ComponentPalette } from "./ComponentPalette";
import { FormPreview } from "./FormPreview";
import { EvaluationSectionsModule } from "./EvaluationSectionsModule";
import { ClinicalComponentPalette } from "./ClinicalComponentPalette";
import { ConditionalLogicPanel } from "./ConditionalLogicPanel";
import { createFormTemplate, updateFormTemplate, getFormTemplates, type TemplateSearchParams } from "@/lib/api-form-builder";
import type { FormTemplate, FormComponent } from "@/lib/api-form-builder";
import type { FormPage } from "@/lib/schemas/api-validation";
import { useFormAutosave } from "@/hooks/useFormAutosave";
import { useFormLock } from "@/hooks/useFormLock";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lock } from "lucide-react";
import { FormSummary } from "./FormSummary";
import { AISummaryElement } from "./components/AISummaryElement";
import TitleElement from "./components/TitleElement";
import SubtitleElement from "./components/SubtitleElement";
import SeparatorElement from "./components/SeparatorElement";
import evaluationSectionsConfig from "./evaluation-sections-config.json";

const templateFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  clinical_context: z.string().min(2, "Clinical context is required"),
  tags: z.string().optional(), // Comma-separated tags
  targetAudience: z.array(z.string()).optional(),
  estimatedCompletionTime: z.number().min(1).max(180).optional(), // minutes
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

export function FormBuilder({ apiToken = '', template, onSave, mode = 'create' }: FormBuilderProps) {
  // Multi-page form state
  const [isMultiPage, setIsMultiPage] = useState(template?.schema?.isMultiPage || false);
  const [pages, setPages] = useState<FormPage[]>(() => {
    if (template?.schema?.pages && template.schema.pages.length > 0) {
      return template.schema.pages;
    }
    // Initialize with a single page if not multi-page
    return [{
      id: 'page_1',
      title: 'Page 1',
      description: '',
      order: 0,
      components: template?.schema?.components || []
    }];
  });
  const [activePageId, setActivePageId] = useState<string>(pages[0]?.id || 'page_1');
  
  // Get current page components
  const currentPage = pages.find(p => p.id === activePageId);
  const components = currentPage?.components || [];
  
  // Helper to update components in the current page
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
  const [draggedComponent, setDraggedComponent] = useState<FormComponent | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'components' | 'evaluation' | 'clinical'>('components');
  const [selectedComponentIndex, setSelectedComponentIndex] = useState<number | null>(null);
  
  // Load Template state
  const [availableTemplates, setAvailableTemplates] = useState<FormTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'updated_at' | 'usage_count' | 'rating'>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const formListRef = useRef<HTMLDivElement>(null);
  const sortableInstanceRef = useRef<Sortable | null>(null);
  
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
    if (pages.length <= 1) return; // Keep at least one page
    
    const pageIndex = pages.findIndex(p => p.id === pageId);
    const newPages = pages.filter(p => p.id !== pageId);
    
    // Update order
    newPages.forEach((page, index) => {
      page.order = index;
    });
    
    setPages(newPages);
    
    // If removing active page, switch to previous or first page
    if (pageId === activePageId) {
      const newActiveIndex = Math.max(0, pageIndex - 1);
      setActivePageId(newPages[newActiveIndex].id);
    }
  }, [pages, activePageId]);
  
  const updatePageTitle = useCallback((pageId: string, title: string) => {
    setPages(prevPages =>
      prevPages.map(page =>
        page.id === pageId ? { ...page, title } : page
      )
    );
  }, []);
  
  const updatePageDescription = useCallback((pageId: string, description: string) => {
    setPages(prevPages =>
      prevPages.map(page =>
        page.id === pageId ? { ...page, description } : page
      )
    );
  }, []);
  
  const reorderPages = useCallback((fromIndex: number, toIndex: number) => {
    const newPages = [...pages];
    const [movedPage] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, movedPage);
    
    // Update order
    newPages.forEach((page, index) => {
      page.order = index;
    });
    
    setPages(newPages);
  }, [pages]);
  
  // Generate session ID for autosave
  const sessionId = useMemo(() => {
    if (template?.id) {
      return `form_${template.id}_${Date.now()}`;
    }
    return `form_new_${Date.now()}`;
  }, [template?.id]);
  
  // TODO: Get from auth context when available
  const userId = "1";
  const userName = "User";
  
  // Form locking
  const {
    status: lockStatus,
    acquireLock,
    releaseLock
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
  
  const [showLockWarning, setShowLockWarning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  
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
  
  // Autosave when components or pages change
  useEffect(() => {
    if (isMultiPage && pages.length > 0) {
      autoSave({
        components: [], // Empty for multi-page forms
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
  }, [components, pages, isMultiPage, autoSave]);
  
  // Initialize SortableJS for form components
  useEffect(() => {
    if (!formListRef.current || previewMode) return;

    sortableInstanceRef.current = Sortable.create(formListRef.current, {
      group: {
        name: 'form-components',
        put: true
      },
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onEnd: (evt: Sortable.SortableEvent) => {
        if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
          moveComponent(evt.oldIndex, evt.newIndex);
        }
      },
      // Touch support for mobile/iPad
      forceFallback: true,
      fallbackTolerance: 3,
      fallbackOnBody: true,
      swapThreshold: 0.65,
      // iOS specific optimizations
      delayOnTouchOnly: true,
      touchStartThreshold: 5
    });

    return () => {
      sortableInstanceRef.current?.destroy();
    };
  }, [previewMode]);
  
  // iOS keyboard handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        // Delay to ensure keyboard is open
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };
    
    const handleResize = () => {
      // Handle viewport changes when keyboard opens/closes
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
  
  // Autosave form metadata changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (components.length > 0) {
        autoSave({
          components,
          metadata: value
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form, components, autoSave]);

  const addComponent = useCallback((component: FormComponent, targetIndex?: number) => {
    console.log('FormBuilder: addComponent called with', component);
    console.log('Component type:', component.type);
    console.log('Component sectionId:', (component as any).sectionId);
    
    const newComponents = [...components];
    const insertIndex = targetIndex !== undefined ? targetIndex : newComponents.length;
    
    // Add new component with unique ID
    const newComponent: FormComponent = {
      ...component,
      id: component.id || `${component.type}_${Date.now()}`,
      order: insertIndex,
    };

    newComponents.splice(insertIndex, 0, newComponent);
    
    // Update order for all components
    newComponents.forEach((comp, index) => {
      comp.order = index;
    });

    console.log('FormBuilder: setting components to', newComponents);
    console.log('New components array length:', newComponents.length);
    setComponents(newComponents);
  }, [components]);

  const handleDrop = useCallback((event: React.DragEvent, targetIndex?: number) => {
    event.preventDefault();
    
    if (!draggedComponent) return;

    addComponent(draggedComponent, targetIndex);
    setDraggedComponent(null);
    setDragOverIndex(null);
  }, [draggedComponent, addComponent]);

  const handleComponentClick = useCallback((component: FormComponent) => {
    console.log('FormBuilder: handleComponentClick called with', component);
    addComponent(component);
  }, [addComponent]);

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
    const newComponents = components.filter((_: FormComponent, i: number) => i !== index);
    newComponents.forEach((comp: FormComponent, i: number) => {
      comp.order = i;
    });
    setComponents(newComponents);
  }, [components]);

  const updateComponent = useCallback((index: number, updates: Partial<FormComponent>) => {
    const newComponents = [...components];
    newComponents[index] = { ...newComponents[index], ...updates };
    setComponents(newComponents);
  }, [components]);

  // Load templates function
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
        status: 'active', // Only show active templates
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

  // Load templates when dialog opens or search parameters change
  useEffect(() => {
    if (loadTemplateOpen) {
      loadTemplates();
    }
  }, [loadTemplateOpen, loadTemplates]);

  // Handle template selection
  const handleTemplateSelect = (selectedTemplate: FormTemplate) => {
    if (selectedTemplate.schema) {
      // Check if it's a multi-page form
      if (selectedTemplate.schema.isMultiPage && selectedTemplate.schema.pages) {
        setIsMultiPage(true);
        setPages(selectedTemplate.schema.pages);
        setActivePageId(selectedTemplate.schema.pages[0]?.id || 'page_1');
      } else if (selectedTemplate.schema.components) {
        // Single-page form
        setIsMultiPage(false);
        setPages([{
          id: 'page_1',
          title: 'Page 1',
          description: '',
          order: 0,
          components: selectedTemplate.schema.components
        }]);
        setActivePageId('page_1');
      }
      
      // Update form values with template data
      form.reset({
        name: selectedTemplate.name,
        description: selectedTemplate.description || "",
        category: selectedTemplate.category || "",
        subcategory: (selectedTemplate.metadata as any)?.subcategory || "",
        clinical_context: selectedTemplate.clinical_context || "",
        tags: (selectedTemplate.metadata as any)?.tags?.join(', ') || "",
        targetAudience: (selectedTemplate.metadata as any)?.targetAudience || [],
        estimatedCompletionTime: (selectedTemplate.metadata as any)?.estimatedCompletionTime || 15,
        showIplcLogo: selectedTemplate.metadata?.showIplcLogo ?? true,
        logoPosition: (selectedTemplate.metadata as any)?.logoPosition || 'top-left',
        primaryColor: (selectedTemplate.metadata as any)?.customStyling?.primaryColor || "#007bff",
        fontFamily: (selectedTemplate.metadata as any)?.customStyling?.fontFamily || "system",
        isPublic: (selectedTemplate.metadata as any)?.isPublic ?? false,
      });
      
      setLoadTemplateOpen(false);
    }
  };

  // Get unique categories and tags for filtering
  const availableCategories = useMemo(() => {
    const categories = new Set(availableTemplates.map(t => t.category));
    return Array.from(categories).filter(Boolean);
  }, [availableTemplates]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    availableTemplates.forEach(template => {
      const templateTags = (template.metadata as any)?.tags || [];
      templateTags.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags);
  }, [availableTemplates]);

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
        },
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

      if (response.success && response.template) {
        // Delete the autosave session after successful save
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

  return (
    <div className="form-builder-container flex h-screen bg-background">
      {/* Component Palette Sidebar - Dynamic width container */}
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
              onComponentDrag={setDraggedComponent}
              onComponentClick={handleComponentClick}
            />
          </TabsContent>
          <TabsContent value="evaluation" className="flex-1 mt-0 overflow-hidden">
            <EvaluationSectionsModule
              onSectionDrag={setDraggedComponent}
              onComponentClick={handleComponentClick}
            />
          </TabsContent>
          <TabsContent value="clinical" className="flex-1 mt-0 overflow-hidden">
            <ClinicalComponentPalette
              onComponentDrag={setDraggedComponent}
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
         <div className="border-b bg-card">
           {/* Multi-page tabs */}
           {isMultiPage && (
             <div className="border-b px-4 pt-2">
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                   <h3 className="text-sm font-medium text-muted-foreground">Form Pages</h3>
                   <Badge variant="secondary" className="text-xs">
                     {pages.length} {pages.length === 1 ? 'page' : 'pages'}
                   </Badge>
                 </div>
                 <div className="flex items-center gap-2">
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={addPage}
                     className="h-7 text-xs"
                   >
                     <Plus className="h-3 w-3 mr-1" />
                     Add Page
                   </Button>
                   <Switch
                     checked={isMultiPage}
                     onCheckedChange={(checked) => {
                       setIsMultiPage(checked);
                       if (!checked) {
                         // When switching to single page, merge all components
                         const allComponents = pages.flatMap(p => p.components);
                         setPages([{
                           id: 'page_1',
                           title: 'Page 1',
                           description: '',
                           order: 0,
                           components: allComponents
                         }]);
                         setActivePageId('page_1');
                       }
                     }}
                   />
                 </div>
               </div>
               
               <Tabs value={activePageId} onValueChange={setActivePageId}>
                 <TabsList className="h-auto p-0 bg-transparent">
                   {pages.map((page, index) => (
                     <TabsTrigger
                       key={page.id}
                       value={page.id}
                       className="relative data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-t-lg border border-b-0 data-[state=active]:border-gray-200 data-[state=inactive]:border-transparent data-[state=inactive]:bg-transparent px-4 py-2 mr-1"
                     >
                       <div className="flex items-center gap-2">
                         <span className="text-sm font-medium">{page.title}</span>
                         <Badge variant="outline" className="text-xs">
                           {page.components.length}
                         </Badge>
                         {pages.length > 1 && (
                           <Button
                             variant="ghost"
                             size="icon"
                             className="h-4 w-4 ml-1 opacity-0 hover:opacity-100 transition-opacity"
                             onClick={(e) => {
                               e.stopPropagation();
                               removePage(page.id);
                             }}
                           >
                             <Trash2 className="h-3 w-3" />
                           </Button>
                         )}
                       </div>
                     </TabsTrigger>
                   ))}
                 </TabsList>
               </Tabs>
             </div>
           )}
           
           <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">
                {template ? `Edit: ${template.name}` : "New Form Template"}
              </h2>
              {!isMultiPage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMultiPage(true)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Convert to Multi-Page
                </Button>
              )}
              
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
                onClick={() => setLoadTemplateOpen(true)}
              >
                <Download className="mr-2 h-4 w-4" />
                Load Template
              </Button>
              
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
               <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Save Template</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs defaultValue="basic" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="metadata">Metadata</TabsTrigger>
                            <TabsTrigger value="styling">Styling</TabsTrigger>
                            <TabsTrigger value="sharing">Sharing</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="basic" className="space-y-4 mt-6">
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
                            <div className="grid grid-cols-2 gap-4">
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
                                name="subcategory"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Subcategory</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Initial Assessment" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
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
                          </TabsContent>
  
                          <TabsContent value="metadata" className="space-y-4 mt-6">
                            <FormField
                              control={form.control}
                              name="tags"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Tags
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter tags separated by commas" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Separate multiple tags with commas (e.g., pediatric, assessment, standardized)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="targetAudience"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Target Audience
                                  </FormLabel>
                                  <div className="grid grid-cols-2 gap-2">
                                    {['SLP', 'OT', 'PT', 'Psychologist', 'Social Worker', 'Case Manager'].map((audience) => (
                                      <div key={audience} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={audience}
                                          checked={field.value?.includes(audience) || false}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              field.onChange([...(field.value || []), audience]);
                                            } else {
                                              field.onChange(field.value?.filter((item: string) => item !== audience) || []);
                                            }
                                          }}
                                        />
                                        <label htmlFor={audience} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                          {audience}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="estimatedCompletionTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Estimated Completion Time (minutes)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      max="180"
                                      placeholder="15"
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TabsContent>
  
                          <TabsContent value="styling" className="space-y-4 mt-6">
                            <FormField
                              control={form.control}
                              name="showIplcLogo"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Show IPLC Logo</FormLabel>
                                    <FormDescription>
                                      Display the IPLC logo on the form
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            {form.watch('showIplcLogo') && (
                              <FormField
                                control={form.control}
                                name="logoPosition"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Logo Position</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select logo position" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="top-left">Top Left</SelectItem>
                                        <SelectItem value="top-center">Top Center</SelectItem>
                                        <SelectItem value="top-right">Top Right</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="primaryColor"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                      <Palette className="w-4 h-4" />
                                      Primary Color
                                    </FormLabel>
                                    <FormControl>
                                      <div className="flex gap-2">
                                        <Input
                                          type="color"
                                          className="w-12 h-10 p-1 border-2"
                                          {...field}
                                        />
                                        <Input
                                          type="text"
                                          placeholder="#007bff"
                                          {...field}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="fontFamily"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Font Family</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select font family" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="system">System Default</SelectItem>
                                        <SelectItem value="Arial">Arial</SelectItem>
                                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                        <SelectItem value="Georgia">Georgia</SelectItem>
                                        <SelectItem value="Verdana">Verdana</SelectItem>
                                        <SelectItem value="Calibri">Calibri</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </TabsContent>
  
                          <TabsContent value="sharing" className="space-y-4 mt-6">
                            <FormField
                              control={form.control}
                              name="isPublic"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base flex items-center gap-2">
                                      <Share2 className="w-4 h-4" />
                                      Public Template
                                    </FormLabel>
                                    <FormDescription>
                                      Make this template available to other users in your organization
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            {form.watch('isPublic') && (
                              <div className="rounded-lg border p-4 bg-blue-50">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">Public Template Benefits</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                  <li>• Other users can discover and use your template</li>
                                  <li>• Contributes to the organization's template library</li>
                                  <li>• Can be rated and reviewed by other users</li>
                                  <li>• Usage analytics will be tracked</li>
                                </ul>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
  
                        <div className="flex justify-end space-x-2 pt-4 border-t">
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
            </div>
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
                <div className="space-y-4" ref={formListRef}>
                  {components.map((component: FormComponent, index: number) => (
                    <div
                      key={component.id}
                      data-id={component.id}
                      className={`relative group border rounded-lg p-4 bg-white ${
                        dragOverIndex === index ? "border-primary bg-primary/5" :
                        selectedComponentIndex === index ? "border-blue-500 bg-blue-50/50" : "border-gray-200"
                      } transition-all duration-200 cursor-pointer`}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onClick={() => setSelectedComponentIndex(index === selectedComponentIndex ? null : index)}
                    >
                      {/* Component Controls */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                            onClick={() => removeComponent(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="drag-handle cursor-move p-2 hover:bg-gradient-metallic-primary hover:text-white rounded-md shadow-sm border border-gray-200 hover:border-iplc-primary transition-all duration-150"
                               style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GripVertical className="h-5 w-5" />
                          </div>
                        </div>
                      </div>

                      {/* Component Content */}
                      <div className="pr-16">
                        <ComponentRenderer
                          component={component}
                          onUpdate={(updates: Partial<FormComponent>) => updateComponent(index, updates)}
                          isEditing={true}
                          allComponents={components}
                        />
                      </div>
                      
                      {/* Conditional Logic Panel */}
                      {selectedComponentIndex === index && component.type !== 'title_subtitle' && component.type !== 'line_separator' && component.type !== 'evaluation_section' && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <ConditionalLogicPanel
                            component={component}
                            allComponents={components}
                            onUpdate={(updates) => updateComponent(index, updates)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Load Template Dialog */}
      <Dialog open={loadTemplateOpen} onOpenChange={setLoadTemplateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Load Template</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 h-[70vh]">
            {/* Search and Filter Controls */}
            <div className="flex flex-col gap-4 border-b pb-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Tags Filter */}
                <Select value={selectedTags.join(',')} onValueChange={(value) => setSelectedTags(value ? value.split(',') : [])}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Tags</SelectItem>
                    {availableTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Sort Controls */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'created_at' | 'updated_at' | 'usage_count' | 'rating')}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="usage_count">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
                
                {/* View Toggle */}
                <div className="flex ml-auto">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Active Filters Display */}
              {(selectedCategory || selectedTags.length > 0 || searchQuery) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {searchQuery}
                      <button onClick={() => setSearchQuery('')}>×</button>
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('')}>×</button>
                    </Badge>
                  )}
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      Tag: {tag}
                      <button onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}>×</button>
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                      setSelectedTags([]);
                    }}
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
            
            {/* Templates Grid/List */}
            <div className="flex-1 overflow-auto">
              {templatesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading templates...</p>
                  </div>
                </div>
              ) : availableTemplates.length === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">No templates found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                  </div>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                  {availableTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                        viewMode === 'list' ? 'flex items-center gap-4' : ''
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {viewMode === 'grid' ? (
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium truncate">{template.name}</h3>
                            {template.metadata?.is_featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          
                          {template.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {template.description}
                            </p>
                          )}
                          
                          <div className="space-y-2">
                            {template.metadata?.category && (
                              <Badge variant="outline" className="text-xs">
                                {template.metadata.category}
                              </Badge>
                            )}
                            
                            {template.metadata?.tags && template.metadata.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {template.metadata.tags.slice(0, 3).map((tag: string) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {template.metadata.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{template.metadata.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {template.created_at && new Date(template.created_at).toLocaleDateString()}
                              </span>
                              {template.metadata?.usage_count && (
                                <span>{template.metadata.usage_count} uses</span>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{template.name}</h3>
                              {template.metadata?.is_featured && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                              {template.metadata?.category && (
                                <Badge variant="outline" className="text-xs">
                                  {template.metadata.category}
                                </Badge>
                              )}
                            </div>
                            
                            {template.description && (
                              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                            )}
                            
                            {template.metadata?.tags && template.metadata.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {template.metadata.tags.slice(0, 5).map((tag: string) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {template.metadata.tags.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{template.metadata.tags.length - 5}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">
                              {template.created_at && new Date(template.created_at).toLocaleDateString()}
                            </div>
                            {template.metadata?.usage_count && (
                              <div className="text-xs text-gray-500">
                                {template.metadata.usage_count} uses
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end border-t pt-4">
            <Button variant="outline" onClick={() => setLoadTemplateOpen(false)}>
              Cancel
            </Button>
          </div>
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
  );
}
// Component renderer for displaying and editing form components
function ComponentRenderer({
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
        {section.fields.map((field: any, fieldIndex: number) => {
          // Render each field based on its type
          switch (field.type) {
            case 'section_header':
              return (
                <div key={fieldIndex} className={`mt-${field.level === 1 ? '4' : '3'} mb-2 pt-${field.level === 1 ? '4' : '3'} ${fieldIndex > 0 ? 'border-t border-blue-200' : ''}`}>
                  <h4 className={`text-${field.level === 1 ? 'lg' : 'md'} font-semibold text-gray-800`}>{field.label}</h4>
                </div>
              );
              
            case 'subsection':
              return (
                <div key={fieldIndex} className="mt-3 mb-2">
                  <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{field.label}</h5>
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
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    disabled={!isEditing}
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
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    rows={field.rows || 3}
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
              );
              
            case 'select':
              return (
                <div key={fieldIndex} className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Select disabled={!isEditing}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option: string, optIndex: number) => (
                        <SelectItem key={optIndex} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
              
            case 'date':
              return (
                <div key={fieldIndex} className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Input
                    type="date"
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
              );
              
            case 'number':
              return (
                <div key={fieldIndex} className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <Input
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    disabled={!isEditing}
                    className="text-sm"
                  />
                </div>
              );
              
            case 'rating_scale':
              return (
                <div key={fieldIndex} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{field.label}</label>
                  <div className="flex items-center space-x-2">
                    {field.scale.map((value: number, scaleIndex: number) => (
                      <div key={scaleIndex} className="flex flex-col items-center">
                        <button
                          type="button"
                          disabled={!isEditing}
                          className={`w-8 h-8 rounded-full border-2 ${
                            isEditing ? 'hover:bg-gradient-metallic-primary hover:border-iplc-primary hover:text-white hover:shadow-md' : ''
                          } border-gray-300 bg-white text-xs font-medium transition-all duration-150`}
                        >
                          {value}
                        </button>
                        {field.labels && field.labels[scaleIndex] && (
                          <span className="text-xs text-gray-500 mt-1 text-center max-w-[60px]">
                            {field.labels[scaleIndex]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
              
            case 'checkbox_group':
              return (
                <div key={fieldIndex} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{field.label}</label>
                  <div className="space-y-1 pl-2">
                    {field.options?.map((option: string, optIndex: number) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <Checkbox disabled={!isEditing} id={`${field.id}_${optIndex}`} />
                        <label
                          htmlFor={`${field.id}_${optIndex}`}
                          className="text-sm text-gray-600 cursor-pointer"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
              
            case 'rating_grid':
            case 'assistance_grid':
              return (
                <div key={fieldIndex} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{field.label}</label>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-medium text-gray-600 p-2"></th>
                          {field.columns.map((col: string, colIndex: number) => (
                            <th key={colIndex} className="text-center text-xs font-medium text-gray-600 p-2 min-w-[80px]">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {field.rows.map((row: string, rowIndex: number) => (
                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : ''}>
                            <td className="text-sm text-gray-700 p-2 font-medium">{row}</td>
                            {field.columns.map((col: string, colIndex: number) => (
                              <td key={colIndex} className="text-center p-2">
                                <input
                                  type="radio"
                                  name={`${field.id}_${rowIndex}`}
                                  disabled={!isEditing}
                                  className="h-4 w-4"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
              
            case 'repeating_group':
              return (
                <div key={fieldIndex} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">{field.label}</label>
                    {isEditing && (
                      <Button size="sm" variant="outline" className="text-xs hover:bg-gradient-metallic-primary hover:text-white hover:border-iplc-primary transition-all duration-150">
                        <Plus className="h-3 w-3 mr-1" />
                        {field.addButtonLabel || 'Add Item'}
                      </Button>
                    )}
                  </div>
                  <div className="border border-gray-200 rounded p-3 bg-gray-50">
                    <div className="space-y-2">
                      {field.fields.map((subField: any, subIndex: number) => (
                        <div key={subIndex} className="text-sm">
                          <span className="font-medium text-gray-600">{subField.label}</span>
                          <span className="text-gray-400 ml-2">({subField.type})</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This section allows multiple entries
                    </p>
                  </div>
                </div>
              );
              
            default:
              return (
                <div key={fieldIndex} className="pl-4 border-l-2 border-blue-200">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">{field.label}</span>
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                    <div className="text-xs text-gray-500 mt-1">Type: {field.type}</div>
                  </div>
                </div>
              );
          }
        })}
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