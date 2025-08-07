// Component Palette for Form Builder - IPLC Forms v3
// Draggable component library for form creation

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Type,
  FileText,
  ChevronDown,
  CheckSquare,
  Circle,
  Calendar,
  Hash,
  BarChart3,
  Sparkles,
  Heading,
  Heading2,
  Minus,
  ClipboardList,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Palette
} from 'lucide-react';

interface ComponentPaletteItem {
  id: string;
  type: 'text_input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number' | 'scale' | 'ai_summary' | 'title_subtitle' | 'subtitle' | 'line_separator' | 'evaluation_section';
  label: string;
  icon: React.ReactNode;
  description: string;
  category: 'Basic' | 'Selection' | 'Advanced' | 'Content';
}

const componentItems: ComponentPaletteItem[] = [
  {
    id: 'text_input',
    type: 'text_input',
    label: 'Text Input',
    icon: <Type className="h-4 w-4" />,
    description: 'Single line text field',
    category: 'Basic'
  },
  {
    id: 'textarea',
    type: 'textarea',
    label: 'Text Area',
    icon: <FileText className="h-4 w-4" />,
    description: 'Multi-line text field',
    category: 'Basic'
  },
  {
    id: 'select',
    type: 'select',
    label: 'Dropdown',
    icon: <ChevronDown className="h-4 w-4" />,
    description: 'Single selection dropdown',
    category: 'Selection'
  },
  {
    id: 'radio',
    type: 'radio',
    label: 'Radio Buttons',
    icon: <Circle className="h-4 w-4" />,
    description: 'Single selection options',
    category: 'Selection'
  },
  {
    id: 'checkbox',
    type: 'checkbox',
    label: 'Checkboxes',
    icon: <CheckSquare className="h-4 w-4" />,
    description: 'Multiple selection options',
    category: 'Selection'
  },
  {
    id: 'date',
    type: 'date',
    label: 'Date Picker',
    icon: <Calendar className="h-4 w-4" />,
    description: 'Date selection field',
    category: 'Advanced'
  },
  {
    id: 'number',
    type: 'number',
    label: 'Number Input',
    icon: <Hash className="h-4 w-4" />,
    description: 'Numeric input field',
    category: 'Advanced'
  },
  {
    id: 'scale',
    type: 'scale',
    label: 'Rating Scale',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Numerical rating scale',
    category: 'Advanced'
  },
  {
    id: 'ai_summary',
    type: 'ai_summary',
    label: 'AI Summary',
    icon: <Sparkles className="h-4 w-4" />,
    description: 'AI-generated summary of selected form data',
    category: 'Advanced'
  },
  {
    id: 'title_subtitle',
    type: 'title_subtitle',
    label: 'Title',
    icon: <Heading className="h-4 w-4" />,
    description: 'Main heading with typography controls',
    category: 'Content'
  },
  {
    id: 'subtitle',
    type: 'subtitle',
    label: 'Subtitle',
    icon: <Heading2 className="h-4 w-4" />,
    description: 'Secondary heading with styling options',
    category: 'Content'
  },
  {
    id: 'line_separator',
    type: 'line_separator',
    label: 'Separator',
    icon: <Minus className="h-4 w-4" />,
    description: 'Visual line separator with style options',
    category: 'Content'
  },
  {
    id: 'evaluation_section',
    type: 'evaluation_section',
    label: 'Evaluation Section',
    icon: <ClipboardList className="h-4 w-4" />,
    description: 'Clinical evaluation sections with structured fields',
    category: 'Advanced'
  }
];

const categoryColors = {
  'Basic': 'bg-iplc-accent-sky/20 text-iplc-accent-sky-dark border-iplc-accent-sky/30',
  'Selection': 'bg-iplc-accent-green/20 text-iplc-accent-green-dark border-iplc-accent-green/30',
  'Advanced': 'bg-gradient-metallic-primary/20 text-iplc-primary border-iplc-primary/30',
  'Content': 'bg-iplc-accent-gold/20 text-iplc-accent-gold-dark border-iplc-accent-gold/30'
};

interface ComponentPaletteProps {
  className?: string;
  onComponentDrag?: (component: any) => void;
  onComponentClick?: (component: any) => void;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ className = '', onComponentDrag, onComponentClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-collapse on mobile
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const createComponent = (item: ComponentPaletteItem) => {
    const suffix = (typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? crypto.randomUUID() : `${Date.now()}`;
    return {
      type: item.type,
      label: item.label,
      id: `${item.type}_${suffix}`,
      props: {
        required: false,
        placeholder: `Enter ${item.label.toLowerCase()}...`,
        description: '',
        ...(item.type === 'select' || item.type === 'radio' || item.type === 'checkbox' ? {
          options: ['Option 1', 'Option 2', 'Option 3']
        } : {}),
        ...(item.type === 'number' || item.type === 'scale' ? {
          min: 0,
          max: 100
        } : {}),
        ...(item.type === 'scale' ? {
          min: 1,
          max: 10
        } : {}),
        ...(item.type === 'ai_summary' ? {
          aiSummaryConfig: {
            autoSelectFields: false,
            defaultPrompt: '',
            maxLength: 500,
            includeMedicalContext: true,
            sourceFieldLabels: true
          }
        } : {}),
        ...(item.type === 'title_subtitle' ? {
          text: 'Main Title',
          level: 'h1',
          fontFamily: 'system',
          fontSize: '3xl',
          fontWeight: 'bold',
          color: '#1f2937',
          alignment: 'left',
          marginTop: 0,
          marginBottom: 16,
          enableMarkdown: false
        } : {}),
        ...(item.type === 'subtitle' ? {
          text: 'Subtitle text',
          level: 'h3',
          fontFamily: 'system',
          fontSize: 'lg',
          fontWeight: 'medium',
          color: '#6b7280',
          alignment: 'left',
          marginTop: 8,
          marginBottom: 12,
          enableMarkdown: false
        } : {}),
        ...(item.type === 'line_separator' ? {
          style: 'solid',
          thickness: 1,
          color: '#e5e7eb',
          width: 100,
          marginTop: 16,
          marginBottom: 16
        } : {}),
        ...(item.type === 'evaluation_section' ? {
          sectionKey: 'default',
          headerLevel: 'h2',
          showScores: true,
          showDate: true,
          enableComments: true,
          selectedFields: []
        } : {})
      }
    };
  };

  const handleDragStart = (e: React.DragEvent, item: ComponentPaletteItem) => {
    const component = createComponent(item);
    
    // Call the onComponentDrag callback if provided
    if (onComponentDrag) {
      onComponentDrag(component);
    }
    
    // Set drag data for drag and drop functionality
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClick = (e: React.MouseEvent, item: ComponentPaletteItem) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('ComponentPalette: handleClick called for', item.type);
    if (onComponentClick) {
      const component = createComponent(item);
      console.log('ComponentPalette: calling onComponentClick with', component);
      onComponentClick(component);
    } else {
      console.log('ComponentPalette: onComponentClick not provided');
    }
  };

  const groupedComponents = componentItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ComponentPaletteItem[]>);

  return (
    <div
      className={cn(
        "component-palette relative h-full flex flex-col bg-[#153F81] transition-all duration-300 ease-in-out",
        "iplc-shadow-xl border-r-2 border-[#27599F]/30",
        isCollapsed ? "w-16" : "w-80",
        isMobile && "fixed top-0 left-0 z-50 h-screen",
        isMobile && isCollapsed && "-translate-x-full",
        className
      )}
    >
      {/* Fixed Header */}
      <div className={cn(
        "p-4 border-b border-white/10 flex-shrink-0",
        "bg-gradient-to-r from-[#153F81] to-[#27599F]",
        "relative"
      )}>
        <div className="flex items-center justify-between">
          <div className={cn(
            "transition-all duration-300",
            isCollapsed && !isMobile && "opacity-0"
          )}>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-iplc-accent-gold" />
              <h3 className="text-lg font-bold text-white">Components</h3>
            </div>
            <p className="text-sm text-white/80 mt-1">Drag to add to form</p>
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={cn(
              "rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all group",
              isCollapsed && !isMobile ? "w-10 h-10" : "w-10 h-10 ml-2",
              isMobile && isCollapsed && "fixed left-4 top-4 z-50 bg-[#153F81] iplc-shadow-lg"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              isMobile ? (
                <Menu className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <ChevronRight className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
              )
            ) : (
              isMobile ? (
                <X className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
              )
            )}
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className={cn(
        "flex-1 overflow-y-auto custom-scrollbar",
        isCollapsed && !isMobile && "overflow-hidden"
      )}>
        {isCollapsed && !isMobile ? (
          // Collapsed state - show icons only
          <div className="p-2 space-y-2">
            {componentItems.map((item) => (
              <button
                key={item.id}
                className="w-full p-2 rounded-lg bg-white/10 hover:bg-gradient-metallic-primary transition-all group"
                onClick={(e) => handleClick(e, item)}
                title={item.label}
                role="button"
                aria-label={`Add ${item.label}`}
                data-component-type={item.type}
                data-testid={`palette-item-${item.type}`}
                tabIndex={0}
                style={{ touchAction: 'manipulation' as React.CSSProperties['touchAction'] }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(e as any, item);
                  }
                }}
              >
                <div className="text-white group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Expanded state
          <div className="p-4 space-y-6">
            {Object.entries(groupedComponents).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-sm font-semibold text-white">{category}</h4>
                  <Badge variant="outline" className={cn(
                    "text-xs px-2 py-0.5 border font-medium",
                    categoryColors[category as keyof typeof categoryColors]
                  )}>
                    {items.length}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className={cn(
                        "cursor-move transition-all duration-200",
                        "border border-white/20 bg-white/10 backdrop-blur-sm",
                        "hover:bg-gradient-metallic-primary hover:border-iplc-accent-gold/50",
                        "hover:iplc-shadow-md hover:scale-[1.02]"
                      )}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={(e) => handleClick(e, item)}
                      data-component-type={item.type}
                      data-testid={`palette-item-${item.type}`}
                      role="button"
                      aria-label={`Add ${item.label}`}
                      tabIndex={0}
                      style={{ touchAction: 'manipulation' as React.CSSProperties['touchAction'] }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleClick(e as any, item);
                        }
                      }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "flex-shrink-0 p-2 rounded-lg",
                            "bg-gradient-to-br from-white/20 to-white/10",
                            "border border-white/20"
                          )}>
                            <div className="text-white">
                              {item.icon}
                            </div>
                          </div>
                          <div className="flex-grow min-w-0">
                            <h5 className="text-sm font-semibold text-white">
                              {item.label}
                            </h5>
                            <p className="text-xs text-white/70 mt-0.5 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Fixed Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10 bg-gradient-to-r from-[#27599F] to-[#153F81] flex-shrink-0">
          <div className="text-xs text-white/80">
            <p className="font-semibold mb-1 text-iplc-accent-gold">Quick Tips:</p>
            <ul className="space-y-1">
              <li>• Drag components to the form area</li>
              <li>• Click components to edit properties</li>
              <li>• Reorder by dragging within the form</li>
            </ul>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 -z-10"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};