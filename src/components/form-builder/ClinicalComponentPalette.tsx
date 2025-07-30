import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Search, Filter, ChevronRight, Activity, Brain, Heart, Stethoscope, User, FileText, Calendar, Clock, Pill, TestTube, Eye, Ear, Hand, Footprints, Users, Baby, UserPlus, Briefcase, Home, Car, Utensils, Bath, Shirt, BookOpen, Gamepad } from "lucide-react";
import type { FormComponent } from "@/lib/api-form-builder";
import clinicalConfig from './clinical-components-config.json';

// Type the imported JSON data
interface ClinicalConfigData {
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    subcategories: Array<{
      id: string;
      name: string;
      components: Array<{
        id: string;
        name: string;
        type: string;
        discipline: string;
        description?: string;
        fields?: any[];
        config?: any;
      }>;
    }>;
  }>;
}

interface ClinicalComponentPaletteProps {
  onComponentDrag: (component: FormComponent) => void;
  onComponentClick: (component: FormComponent) => void;
  selectedDiscipline?: 'OT' | 'SLP' | 'Both';
}

interface ClinicalComponentCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  subcategories: ClinicalSubcategory[];
}

interface ClinicalSubcategory {
  id: string;
  name: string;
  components: ClinicalComponentDefinition[];
}

interface ClinicalComponentDefinition {
  id: string;
  name: string;
  type: string;
  discipline: 'OT' | 'SLP' | 'Both';
  description?: string;
  fields?: any[];
  config?: any;
}

const iconMap: Record<string, React.ReactNode> = {
  activity: <Activity className="h-4 w-4" />,
  brain: <Brain className="h-4 w-4" />,
  heart: <Heart className="h-4 w-4" />,
  stethoscope: <Stethoscope className="h-4 w-4" />,
  user: <User className="h-4 w-4" />,
  filetext: <FileText className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
  clock: <Clock className="h-4 w-4" />,
  pill: <Pill className="h-4 w-4" />,
  testtube: <TestTube className="h-4 w-4" />,
  eye: <Eye className="h-4 w-4" />,
  ear: <Ear className="h-4 w-4" />,
  hand: <Hand className="h-4 w-4" />,
  footprints: <Footprints className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  baby: <Baby className="h-4 w-4" />,
  userplus: <UserPlus className="h-4 w-4" />,
  briefcase: <Briefcase className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  car: <Car className="h-4 w-4" />,
  utensils: <Utensils className="h-4 w-4" />,
  bath: <Bath className="h-4 w-4" />,
  shirt: <Shirt className="h-4 w-4" />,
  bookopen: <BookOpen className="h-4 w-4" />,
  gamepad: <Gamepad className="h-4 w-4" />,
};

export function ClinicalComponentPalette({
  onComponentDrag,
  onComponentClick,
  selectedDiscipline = 'Both'
}: ClinicalComponentPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [disciplineFilter, setDisciplineFilter] = useState<'OT' | 'SLP' | 'Both'>(selectedDiscipline);

  // Load clinical components from config
  const categories: ClinicalComponentCategory[] = clinicalConfig.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    icon: iconMap[cat.icon] || <Shield className="h-4 w-4" />,
    subcategories: cat.subcategories.map(subcat => ({
      id: subcat.id,
      name: subcat.name,
      components: subcat.components.map(comp => ({
        id: comp.id,
        name: comp.name,
        type: comp.type,
        discipline: comp.discipline as 'OT' | 'SLP' | 'Both',
        description: comp.description,
        fields: comp.fields,
        config: comp.config
      }))
    }))
  }));

  // Filter components based on search and discipline
  const filterComponents = (components: ClinicalComponentDefinition[]) => {
    return components.filter(comp => {
      const matchesSearch = searchQuery === '' || 
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDiscipline = disciplineFilter === 'Both' || 
        comp.discipline === 'Both' || 
        comp.discipline === disciplineFilter;
      
      return matchesSearch && matchesDiscipline;
    });
  };

  // Filter categories based on selected category
  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(cat => cat.id === selectedCategory);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleComponentClick = (component: ClinicalComponentDefinition) => {
    const formComponent: FormComponent = {
      id: `${component.type}_${Date.now()}`,
      type: 'clinical_component',
      label: component.name,
      order: 0,
      props: {
        componentType: component.type,
        discipline: component.discipline,
        ...component.config
      },
      // Store the field definitions if this is a structured component
      fields: component.fields
    };
    
    onComponentClick(formComponent);
  };

  const handleDragStart = (e: React.DragEvent, component: ClinicalComponentDefinition) => {
    const formComponent: FormComponent = {
      id: `${component.type}_${Date.now()}`,
      type: 'clinical_component',
      label: component.name,
      order: 0,
      props: {
        componentType: component.type,
        discipline: component.discipline,
        ...component.config
      },
      fields: component.fields
    };
    
    e.dataTransfer.effectAllowed = 'copy';
    onComponentDrag(formComponent);
  };

  // Auto-expand categories when searching
  useEffect(() => {
    if (searchQuery) {
      const categoriesToExpand = new Set<string>();
      categories.forEach(cat => {
        cat.subcategories.forEach(subcat => {
          const hasMatchingComponents = filterComponents(subcat.components).length > 0;
          if (hasMatchingComponents) {
            categoriesToExpand.add(cat.id);
          }
        });
      });
      setExpandedCategories(categoriesToExpand);
    }
  }, [searchQuery]);

  return (
    <div className="h-full flex flex-col p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Clinical Components
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Specialized components for clinical assessments and documentation
        </p>
        
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clinical components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={disciplineFilter} onValueChange={(value) => setDisciplineFilter(value as 'OT' | 'SLP' | 'Both')}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Both">All Disciplines</SelectItem>
                <SelectItem value="OT">OT Only</SelectItem>
                <SelectItem value="SLP">SLP Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          {filteredCategories.map(category => {
            const isExpanded = expandedCategories.has(category.id);
            const hasMatchingComponents = category.subcategories.some(subcat => 
              filterComponents(subcat.components).length > 0
            );
            
            if (!hasMatchingComponents && searchQuery) return null;
            
            return (
              <Card key={category.id} className="border-l-4 border-l-blue-500">
                <CardHeader 
                  className="cursor-pointer pb-3"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </div>
                    <ChevronRight 
                      className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                  <CardDescription className="text-xs mt-1">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0">
                    {category.subcategories.map(subcategory => {
                      const filteredComponents = filterComponents(subcategory.components);
                      if (filteredComponents.length === 0) return null;
                      
                      return (
                        <div key={subcategory.id} className="mb-4 last:mb-0">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            {subcategory.name}
                          </h4>
                          <div className="grid gap-2">
                            {filteredComponents.map(component => (
                              <div
                                key={component.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, component)}
                                onClick={() => handleComponentClick(component)}
                                className="group relative p-3 bg-white border rounded-lg cursor-move hover:shadow-md hover:border-blue-300 transition-all duration-150"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm">{component.name}</span>
                                      <Badge 
                                        variant={component.discipline === 'OT' ? 'default' : component.discipline === 'SLP' ? 'secondary' : 'outline'}
                                        className="text-xs"
                                      >
                                        {component.discipline}
                                      </Badge>
                                    </div>
                                    {component.description && (
                                      <p className="text-xs text-gray-600">{component.description}</p>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none" />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>
      
      {/* Footer with tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Drag components to the form canvas or click to add them. 
          Use the discipline filter to show components specific to OT or SLP.
        </p>
      </div>
    </div>
  );
}