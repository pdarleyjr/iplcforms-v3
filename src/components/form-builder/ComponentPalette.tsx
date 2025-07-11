// Component Palette for Form Builder - IPLC Forms v3
// Draggable component library for form creation

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  FileText, 
  ChevronDown, 
  CheckSquare, 
  Circle, 
  Calendar, 
  Hash, 
  BarChart3 
} from 'lucide-react';

interface ComponentPaletteItem {
  id: string;
  type: 'text_input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number' | 'scale';
  label: string;
  icon: React.ReactNode;
  description: string;
  category: 'Basic' | 'Selection' | 'Advanced';
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
  }
];

const categoryColors = {
  'Basic': 'bg-blue-100 text-blue-800',
  'Selection': 'bg-green-100 text-green-800',
  'Advanced': 'bg-purple-100 text-purple-800'
};

interface ComponentPaletteProps {
  className?: string;
  onComponentDrag?: (component: any) => void;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ className = '', onComponentDrag }) => {
  const handleDragStart = (e: React.DragEvent, item: ComponentPaletteItem) => {
    const component = {
      type: item.type,
      label: item.label,
      id: `${item.type}_${Date.now()}`,
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
        } : {})
      }
    };
    
    // Call the onComponentDrag callback if provided
    if (onComponentDrag) {
      onComponentDrag(component);
    }
    
    // Set drag data for drag and drop functionality
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const groupedComponents = componentItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ComponentPaletteItem[]>);

  return (
    <div className={`w-72 bg-white border-r border-gray-200 h-full overflow-y-auto ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Components</h3>
        <p className="text-sm text-gray-600 mt-1">Drag components to add to your form</p>
      </div>
      
      <div className="p-4 space-y-6">
        {Object.entries(groupedComponents).map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-medium text-gray-700">{category}</h4>
              <Badge variant="secondary" className={`text-xs ${categoryColors[category as keyof typeof categoryColors]}`}>
                {items.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-move hover:shadow-md transition-shadow duration-200 border-2 border-transparent hover:border-blue-200"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-md">
                        {item.icon}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h5 className="text-sm font-medium text-gray-900 truncate">
                          {item.label}
                        </h5>
                        <p className="text-xs text-gray-600 mt-1">
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
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          <p className="font-medium mb-1">Quick Tips:</p>
          <ul className="space-y-1">
            <li>• Drag components to the form area</li>
            <li>• Click components to edit properties</li>
            <li>• Reorder by dragging within the form</li>
          </ul>
        </div>
      </div>
    </div>
  );
};