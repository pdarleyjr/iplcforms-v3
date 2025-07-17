import React from 'react';
import { renderInlineMarkdown } from '../../../lib/services/markdown';

// Props interface matching the architecture specification
export interface TitleSubtitleProps {
  text: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  fontFamily: 'system' | 'serif' | 'sans-serif' | 'monospace';
  fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  color: string;
  alignment: 'left' | 'center' | 'right';
  marginTop: number;
  marginBottom: number;
  enableMarkdown?: boolean;
}

interface SubtitleElementProps {
  props: TitleSubtitleProps;
  isSelected?: boolean;
  onPropsChange?: (newProps: TitleSubtitleProps) => void;
}

const SubtitleElement: React.FC<SubtitleElementProps> = ({
  props: {
    text = 'Subtitle text',
    level = 'h3',
    fontFamily = 'system',
    fontSize = 'lg',
    fontWeight = 'medium',
    color = '#6b7280',
    alignment = 'left',
    marginTop = 8,
    marginBottom = 12,
    enableMarkdown = false
  },
  isSelected,
  onPropsChange
}) => {
  // Font family mapping
  const fontFamilyMap = {
    system: 'font-system',
    serif: 'font-serif',
    'sans-serif': 'font-sans',
    monospace: 'font-mono'
  };

  // Font size mapping
  const fontSizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  };

  // Font weight mapping
  const fontWeightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  // Alignment mapping
  const alignmentMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const handleInputChange = (field: keyof TitleSubtitleProps, value: any) => {
    if (onPropsChange) {
      onPropsChange({
        text,
        level,
        fontFamily,
        fontSize,
        fontWeight,
        color,
        alignment,
        marginTop,
        marginBottom,
        enableMarkdown,
        [field]: value
      });
    }
  };

  const renderSubtitle = () => {
    const className = `
      ${fontFamilyMap[fontFamily]} 
      ${fontSizeMap[fontSize]} 
      ${fontWeightMap[fontWeight]} 
      ${alignmentMap[alignment]}
      leading-relaxed
    `.trim().replace(/\s+/g, ' ');

    const style = {
      color,
      marginTop: `${marginTop}px`,
      marginBottom: `${marginBottom}px`
    };

    const commonProps = {
      className,
      style
    };

    if (enableMarkdown && text) {
      const renderedContent = renderInlineMarkdown(text);
      return React.createElement(level, {
        ...commonProps,
        dangerouslySetInnerHTML: { __html: renderedContent }
      });
    }

    return React.createElement(level, commonProps, text);
  };

  if (isSelected && onPropsChange) {
    return (
      <div className="space-y-4">
        {/* Preview */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="text-sm text-gray-600 mb-2">Preview:</div>
          {renderSubtitle()}
        </div>

        {/* Property Panel */}
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Subtitle Properties</h3>
          
          {/* Text Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              value={text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="Enter subtitle text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          {/* Markdown Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enable-markdown"
              checked={enableMarkdown}
              onChange={(e) => handleInputChange('enableMarkdown', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="enable-markdown" className="text-sm text-gray-700">
              Enable Markdown
            </label>
          </div>

          {/* Heading Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading Level
            </label>
            <select
              value={level}
              onChange={(e) => handleInputChange('level', e.target.value as TitleSubtitleProps['level'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
            </select>
          </div>

          {/* Typography Controls */}
          <div className="grid grid-cols-2 gap-4">
            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                value={fontFamily}
                onChange={(e) => handleInputChange('fontFamily', e.target.value as TitleSubtitleProps['fontFamily'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="system">System</option>
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans Serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Size
              </label>
              <select
                value={fontSize}
                onChange={(e) => handleInputChange('fontSize', e.target.value as TitleSubtitleProps['fontSize'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="xs">Extra Small</option>
                <option value="sm">Small</option>
                <option value="base">Base</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
                <option value="2xl">2X Large</option>
                <option value="3xl">3X Large</option>
                <option value="4xl">4X Large</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Font Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Weight
              </label>
              <select
                value={fontWeight}
                onChange={(e) => handleInputChange('fontWeight', e.target.value as TitleSubtitleProps['fontWeight'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            {/* Alignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alignment
              </label>
              <select
                value={alignment}
                onChange={(e) => handleInputChange('alignment', e.target.value as TitleSubtitleProps['alignment'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
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
                placeholder="#000000"
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
        </div>
      </div>
    );
  }

  return renderSubtitle();
};

export default SubtitleElement;