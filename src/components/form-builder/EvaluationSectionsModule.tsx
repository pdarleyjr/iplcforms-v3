// Evaluation Sections Module for Form Builder - IPLC Forms v3
// Reusable evaluation section panels for comprehensive clinical assessments

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList,
  Brain,
  Hand,
  MessageSquare,
  Award,
  FileText,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  GripVertical
} from 'lucide-react';
import evaluationSectionsConfig from './evaluation-sections-config.json';

// Type definitions for evaluation section fields
export interface EvaluationField {
  type: 'section_header' | 'subsection' | 'text' | 'textarea' | 'date' |
        'select' | 'number' | 'rating_scale' | 'rating_grid' |
        'checkbox_group' | 'assistance_grid' | 'repeating_group';
  id?: string;
  label: string;
  required?: boolean;
  rows?: number | string[];  // Can be number for textarea or string[] for grids
  options?: string[];
  scale?: number[];
  labels?: string[];
  columns?: string[];
  min?: number;
  max?: number;
  step?: number;
  level?: number;
  fields?: EvaluationField[];
  addButtonLabel?: string;
}

export interface EvaluationSection {
  id: string;
  type: string;  // Allow string to match JSON
  label: string;
  category: string;
  discipline: string;  // Allow string to match JSON
  icon: string;
  description: string;
  fields: EvaluationField[];
}

export interface EvaluationSectionComponent {
  id: string;
  type: 'evaluation_section';
  sectionId: string;
  label: string;
  collapsed?: boolean;
  fieldValues?: Record<string, any>;
  props?: {
    required?: boolean;
    description?: string;
    editable?: boolean;
  };
}

interface EvaluationSectionsModuleProps {
  className?: string;
  onSectionDrag?: (section: any) => void;
  onComponentClick?: (section: any) => void;
  selectedDiscipline?: 'SLP' | 'OT' | 'Both';
}

const iconMap: Record<string, React.ReactNode> = {
  ClipboardList: <ClipboardList className="h-4 w-4" />,
  Brain: <Brain className="h-4 w-4" />,
  Hand: <Hand className="h-4 w-4" />,
  MessageSquare: <MessageSquare className="h-4 w-4" />,
  Award: <Award className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />
};

const categoryColors: Record<string, string> = {
  'Initial Assessment': 'bg-iplc-primary/10 text-iplc-primary border-iplc-primary/20',
  'Cognitive Assessment': 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  'Motor Assessment': 'bg-iplc-green/10 text-iplc-green border-iplc-green/20',
  'Communication Assessment': 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  'Functional Assessment': 'bg-iplc-gold/10 text-iplc-gold border-iplc-gold/20',
  'Testing Results': 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  'Summary': 'bg-gray-500/10 text-gray-700 border-gray-500/20',
  'Progress Monitoring': 'bg-iplc-navy/10 text-iplc-navy border-iplc-navy/20'
};

const disciplineColors: Record<string, string> = {
  'SLP': 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  'OT': 'bg-iplc-green/10 text-iplc-green border-iplc-green/20',
  'Both': 'bg-iplc-primary/10 text-iplc-primary border-iplc-primary/20'
};

export const EvaluationSectionsModule: React.FC<EvaluationSectionsModuleProps> = ({
  className = '',
  onSectionDrag,
  onComponentClick,
  selectedDiscipline = 'Both'
}) => {
  // Debug logging to verify component mount and prop existence
  React.useEffect(() => {
    console.log('EvaluationSectionsModule mounted at', new Date().toISOString());
    console.log('Props received:', {
      hasOnSectionDrag: !!onSectionDrag,
      hasOnComponentClick: !!onComponentClick,
      onComponentClickType: typeof onComponentClick,
      selectedDiscipline
    });
  }, []);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  const sections = evaluationSectionsConfig.evaluationSections as EvaluationSection[];

  const createSectionComponent = (section: EvaluationSection): EvaluationSectionComponent => {
    return {
      id: `evaluation_section_${Date.now()}`,
      type: 'evaluation_section',
      sectionId: section.id,
      label: section.label,
      collapsed: false,
      fieldValues: {},
      props: {
        required: false,
        description: section.description,
        editable: true
      }
    };
  };

  const handleDragStart = (e: React.DragEvent, section: EvaluationSection) => {
    console.log('EvaluationSectionsModule: handleDragStart called for section', section.label);
    const sectionComponent = createSectionComponent(section);

    if (onSectionDrag) {
      console.log('EvaluationSectionsModule: Calling onSectionDrag with component', sectionComponent);
      onSectionDrag(sectionComponent);
    }

    e.dataTransfer.setData('application/json', JSON.stringify(sectionComponent));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    console.log('EvaluationSectionsModule: handleDragEnd called');
    // Reset draggable after drag
    (e.currentTarget as HTMLElement).draggable = false;
  };

  const handleClick = (section: EvaluationSection) => {
    console.log('EvaluationSectionsModule: handleClick called for', section.type);
    if (onComponentClick) {
      const component = createSectionComponent(section);
      console.log('EvaluationSectionsModule: calling onComponentClick with', component);
      onComponentClick(component);
    } else {
      console.log('EvaluationSectionsModule: onComponentClick not provided');
    }
  };

  const toggleSectionPreview = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Filter sections based on selected discipline
  const filteredSections = sections.filter(section => 
    selectedDiscipline === 'Both' || 
    section.discipline === selectedDiscipline || 
    section.discipline === 'Both'
  );

  // Group sections by category
  const groupedSections = filteredSections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {} as Record<string, EvaluationSection[]>);

  const renderFieldPreview = (field: EvaluationField): React.ReactNode => {
    switch (field.type) {
      case 'section_header':
        return (
          <h3 className={`font-bold text-gray-900 ${
            field.level === 1 ? 'text-lg' : 'text-base'
          }`}>
            {field.label}
          </h3>
        );
      
      case 'subsection':
        return (
          <h4 className="font-semibold text-gray-700 text-sm mt-2">
            {field.label}
          </h4>
        );
      
      case 'text':
      case 'date':
        return (
          <div className="mt-1">
            <label className="text-xs text-gray-600">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="h-8 bg-gray-100 rounded border border-gray-300 mt-1"></div>
          </div>
        );
      
      case 'textarea':
        return (
          <div className="mt-1">
            <label className="text-xs text-gray-600">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div
              className="bg-gray-100 rounded border border-gray-300 mt-1"
              style={{ height: `${(typeof field.rows === 'number' ? field.rows : 3) * 1.5}rem` }}
            ></div>
          </div>
        );
      
      case 'select':
        return (
          <div className="mt-1">
            <label className="text-xs text-gray-600">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="h-8 bg-gray-100 rounded border border-gray-300 mt-1 flex items-center px-2">
              <span className="text-xs text-gray-500">
                {field.options?.[0] || 'Select...'}
              </span>
              <ChevronDown className="h-3 w-3 ml-auto text-gray-400" />
            </div>
          </div>
        );
      
      case 'number':
        return (
          <div className="mt-1">
            <label className="text-xs text-gray-600">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="h-8 bg-gray-100 rounded border border-gray-300 mt-1"></div>
          </div>
        );
      
      case 'rating_scale':
        return (
          <div className="mt-1">
            <label className="text-xs text-gray-600">{field.label}</label>
            <div className="flex gap-1 mt-1">
              {field.scale?.map((value, index) => (
                <div 
                  key={value} 
                  className="flex-1 h-6 bg-gray-100 border border-gray-300 rounded text-xs flex items-center justify-center"
                >
                  {value}
                </div>
              ))}
            </div>
            {field.labels && (
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{field.labels[0]}</span>
                <span>{field.labels[field.labels.length - 1]}</span>
              </div>
            )}
          </div>
        );
      
      case 'checkbox_group':
        return (
          <div className="mt-1">
            <label className="text-xs text-gray-600">{field.label}</label>
            <div className="space-y-1 mt-1">
              {field.options?.slice(0, 3).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-3 w-3 border border-gray-300 rounded"></div>
                  <span className="text-xs text-gray-600">{option}</span>
                </div>
              ))}
              {field.options && field.options.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{field.options.length - 3} more
                </span>
              )}
            </div>
          </div>
        );
      
      case 'rating_grid':
      case 'assistance_grid':
        return (
          <div className="mt-1">
            <label className="text-xs text-gray-600">{field.label}</label>
            <div className="bg-gray-50 rounded border border-gray-200 p-2 mt-1">
              <div className="grid grid-cols-5 gap-1 text-xs">
                <div></div>
                {field.columns?.slice(0, 4).map((col, index) => (
                  <div key={index} className="text-center text-gray-500 truncate">
                    {col}
                  </div>
                ))}
                {Array.isArray(field.rows) && field.rows.slice(0, 2).map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <div className="text-gray-600 truncate">{row}</div>
                    {field.columns?.slice(0, 4).map((_, colIndex) => (
                      <div key={colIndex} className="h-4 bg-gray-100 rounded"></div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              {Array.isArray(field.rows) && field.rows.length > 2 && (
                <div className="text-xs text-gray-400 text-center mt-1">
                  +{field.rows.length - 2} more rows
                </div>
              )}
            </div>
          </div>
        );
      
      case 'repeating_group':
        return (
          <div className="mt-1">
            <label className="text-xs text-gray-600">{field.label}</label>
            <div className="bg-gray-50 rounded border border-gray-200 p-2 mt-1">
              <div className="space-y-1">
                {field.fields?.slice(0, 2).map((subfield, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    • {subfield.label}
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 h-6 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                {field.addButtonLabel || 'Add Item'}
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`w-80 bg-white border-r border-gray-200 h-full flex flex-col ${className}`}>
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Evaluation Sections</h3>
        </div>
        <p className="text-sm text-gray-600">
          Comprehensive evaluation modules for clinical assessments
        </p>
        <div className="flex gap-1 mt-2">
          <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${disciplineColors[selectedDiscipline]}`}>
            {selectedDiscipline === 'Both' ? 'All Disciplines' : selectedDiscipline}
          </Badge>
          <Badge variant="outline" className="text-xs px-2 py-0.5 border border-gray-300">
            {filteredSections.length} sections
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {Object.entries(groupedSections).map(([category, categorySections]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-medium text-gray-700">{category}</h4>
              <Badge
                variant="outline"
                className={`text-xs px-2 py-0.5 border ${categoryColors[category] || 'bg-gray-500/10 text-gray-700 border-gray-500/20'}`}
              >
                {categorySections.length}
              </Badge>
            </div>

            <div className="space-y-2">
              {categorySections.map((section) => (
                <Card
                  key={section.id}
                  className="cursor-pointer transition-all duration-200 border border-gray-200 hover:border-iplc-primary hover:iplc-shadow-md bg-white"
                  data-section-id={section.id}
                  onClick={(e) => {
                    console.log('EvaluationSectionsModule: Card onClick triggered for', section.label);
                    console.log('Event target:', e.target);
                    console.log('Current target:', e.currentTarget);
                    console.log('Event type:', e.type);
                    console.log('onComponentClick exists:', !!onComponentClick);
                    console.log('onComponentClick type:', typeof onComponentClick);
                    
                    // Ignore clicks on interactive elements
                    const target = e.target as HTMLElement;
                    if (target.closest('.grip-handle') || target.closest('button')) {
                      console.log('EvaluationSectionsModule: Click on interactive element, ignoring');
                      return;
                    }
                    
                    e.stopPropagation();
                    
                    // Handle as component click
                    if (onComponentClick) {
                      const sectionComponent = createSectionComponent(section);
                      console.log('EvaluationSectionsModule: Calling onComponentClick with component', sectionComponent);
                      onComponentClick(sectionComponent);
                    } else {
                      console.error('EvaluationSectionsModule: No onComponentClick handler provided!');
                    }
                  }}
                  onMouseDown={(e) => {
                    console.log('EvaluationSectionsModule: Card onMouseDown triggered for', section.label);
                    console.log('MouseDown target:', e.target);
                  }}
                  onPointerDown={(e) => {
                    console.log('EvaluationSectionsModule: Card onPointerDown triggered for', section.label);
                    console.log('PointerDown target:', e.target);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-gradient-to-br from-iplc-primary/10 to-iplc-primary/5 rounded-md">
                        {iconMap[section.icon] || <FileText className="h-4 w-4 text-iplc-primary" />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-sm font-medium text-gray-900 truncate">
                            {section.label}
                          </h5>
                          <Badge
                            variant="outline"
                            className={`text-xs px-2 py-0.5 border ${disciplineColors[section.discipline]}`}
                          >
                            {section.discipline}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {section.description}
                        </p>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs p-0 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectionPreview(section.id);
                          }}
                        >
                          {expandedSections.has(section.id) ? (
                            <>
                              <ChevronDown className="h-3 w-3 mr-1" />
                              Hide Fields
                            </>
                          ) : (
                            <>
                              <ChevronRight className="h-3 w-3 mr-1" />
                              Preview Fields ({section.fields.length})
                            </>
                          )}
                        </Button>

                        {expandedSections.has(section.id) && (
                          <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-md max-h-60 overflow-y-auto">
                            {section.fields.map((field, index) => (
                              <div key={index}>
                                {renderFieldPreview(field)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div
                        className="flex-shrink-0 grip-handle cursor-move p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                        draggable
                        onDragStart={(e) => {
                          console.log('EvaluationSectionsModule: Grip handle dragStart for', section.label);
                          e.stopPropagation();
                          handleDragStart(e, section);
                        }}
                        onDragEnd={(e) => {
                          console.log('EvaluationSectionsModule: Grip handle dragEnd');
                          e.stopPropagation();
                        }}
                      >
                        <GripVertical className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-iplc-primary/5 to-iplc-primary/10 flex-shrink-0">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-2 flex items-center gap-1">
            <ClipboardList className="h-3 w-3" />
            Usage Tips:
          </p>
          <ul className="space-y-1">
            <li>• Drag sections to add comprehensive evaluations</li>
            <li>• Each section includes multiple assessment fields</li>
            <li>• Fields are customizable via Property Grid</li>
            <li>• Sections follow clinical best practices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
