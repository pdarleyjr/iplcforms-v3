import React from 'react';

// Props interface matching the architecture specification
export interface LineSeparatorProps {
  style: 'solid' | 'dashed' | 'dotted';
  thickness: number;
  color: string;
  width: number;
  marginTop: number;
  marginBottom: number;
}

interface SeparatorElementProps {
  props: LineSeparatorProps;
  isSelected?: boolean;
  onPropsChange?: (newProps: LineSeparatorProps) => void;
}

const SeparatorElement: React.FC<SeparatorElementProps> = ({
  props: {
    style = 'solid',
    thickness = 1,
    color = '#e5e7eb',
    width = 100,
    marginTop = 16,
    marginBottom = 16
  },
  isSelected,
  onPropsChange
}) => {
  const handleInputChange = (field: keyof LineSeparatorProps, value: any) => {
    if (onPropsChange) {
      onPropsChange({
        style,
        thickness,
        color,
        width,
        marginTop,
        marginBottom,
        [field]: value
      });
    }
  };

  const renderSeparator = () => {
    const separatorStyle = {
      borderTop: `${thickness}px ${style} ${color}`,
      width: `${width}%`,
      marginTop: `${marginTop}px`,
      marginBottom: `${marginBottom}px`,
      marginLeft: 'auto',
      marginRight: 'auto'
    };

    return (
      <hr 
        className="border-0"
        style={separatorStyle}
      />
    );
  };

  if (isSelected && onPropsChange) {
    return (
      <div className="space-y-4">
        {/* Preview */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="text-sm text-gray-600 mb-2">Preview:</div>
          {renderSeparator()}
        </div>

        {/* Property Panel */}
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Separator Properties</h3>
          
          {/* Line Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line Style
            </label>
            <select
              value={style}
              onChange={(e) => handleInputChange('style', e.target.value as LineSeparatorProps['style'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          {/* Thickness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thickness (px)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="1"
                max="10"
                value={thickness}
                onChange={(e) => handleInputChange('thickness', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-8">{thickness}px</span>
            </div>
          </div>

          {/* Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width (%)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="10"
                max="100"
                value={width}
                onChange={(e) => handleInputChange('width', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-10">{width}%</span>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Line Color
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="#e5e7eb"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Spacing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Margin Top (px)
              </label>
              <input
                type="number"
                value={marginTop}
                onChange={(e) => handleInputChange('marginTop', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Margin Bottom (px)
              </label>
              <input
                type="number"
                value={marginBottom}
                onChange={(e) => handleInputChange('marginBottom', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Preset Styles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  handleInputChange('style', 'solid');
                  handleInputChange('thickness', 1);
                  handleInputChange('color', '#e5e7eb');
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Subtle
              </button>
              <button
                onClick={() => {
                  handleInputChange('style', 'solid');
                  handleInputChange('thickness', 2);
                  handleInputChange('color', '#9ca3af');
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Medium
              </button>
              <button
                onClick={() => {
                  handleInputChange('style', 'solid');
                  handleInputChange('thickness', 3);
                  handleInputChange('color', '#6b7280');
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Bold
              </button>
              <button
                onClick={() => {
                  handleInputChange('style', 'dashed');
                  handleInputChange('thickness', 2);
                  handleInputChange('color', '#9ca3af');
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Dashed
              </button>
              <button
                onClick={() => {
                  handleInputChange('style', 'dotted');
                  handleInputChange('thickness', 3);
                  handleInputChange('color', '#9ca3af');
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Dotted
              </button>
              <button
                onClick={() => {
                  handleInputChange('width', 50);
                  handleInputChange('style', 'solid');
                  handleInputChange('thickness', 2);
                }}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Centered
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return renderSeparator();
};

export default SeparatorElement;