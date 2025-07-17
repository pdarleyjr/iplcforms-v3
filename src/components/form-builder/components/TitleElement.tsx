// Title Element Component for IPLC Forms v3
// Renders configurable titles with markdown support and typography options

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Type, Palette, Settings } from 'lucide-react';
import type { FormComponent } from '@/lib/api-form-builder';
import { renderMarkdown, renderInlineMarkdown } from '@/lib/services/markdown';

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

interface TitleElementProps {
  component: FormComponent;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<FormComponent>) => void;
  onRemove?: () => void;
}

const fontFamilyMap = {
  system: 'font-system',
  serif: 'font-serif',
  'sans-serif': 'font-sans',
  monospace: 'font-mono'
};

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

const fontWeightMap = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
};

const alignmentMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
};

export const TitleElement: React.FC<TitleElementProps> = ({
  component,
  isEditing = false,
  onUpdate,
  onRemove
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  // Extract props with defaults
  const props = component.props as TitleSubtitleProps;
  const {
    text = 'Title Text',
    level = 'h2',
    fontFamily = 'system',
    fontSize = 'xl',
    fontWeight = 'semibold',
    color = '#1f2937',
    alignment = 'left',
    marginTop = 16,
    marginBottom = 16,
    enableMarkdown = false
  } = props;

  const updateProps = (updates: Partial<TitleSubtitleProps>) => {
    if (onUpdate) {
      onUpdate({
        props: {
          ...component.props,
          ...updates
        }
      });
    }
  };

  const renderTitle = () => {
    const className = `
      ${fontFamilyMap[fontFamily]}
      ${fontSizeMap[fontSize]}
      ${fontWeightMap[fontWeight]}
      ${alignmentMap[alignment]}
      leading-tight
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

  const renderPropertyPanel = () => (
    <div className="space-y-4 p-4 bg-gray-50 border-t">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Title Properties</Label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Basic Properties */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="title-text" className="text-xs text-gray-600">Text Content</Label>
          <Input
            id="title-text"
            value={text}
            onChange={(e) => updateProps({ text: e.target.value })}
            placeholder="Enter title text..."
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="title-level" className="text-xs text-gray-600">Heading Level</Label>
            <Select value={level} onValueChange={(value) => updateProps({ level: value as TitleSubtitleProps['level'] })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1 - Largest</SelectItem>
                <SelectItem value="h2">H2 - Large</SelectItem>
                <SelectItem value="h3">H3 - Medium</SelectItem>
                <SelectItem value="h4">H4 - Small</SelectItem>
                <SelectItem value="h5">H5 - Smaller</SelectItem>
                <SelectItem value="h6">H6 - Smallest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title-size" className="text-xs text-gray-600">Font Size</Label>
            <Select value={fontSize} onValueChange={(value) => updateProps({ fontSize: value as TitleSubtitleProps['fontSize'] })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="base">Base</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
                <SelectItem value="2xl">2X Large</SelectItem>
                <SelectItem value="3xl">3X Large</SelectItem>
                <SelectItem value="4xl">4X Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="title-weight" className="text-xs text-gray-600">Font Weight</Label>
            <Select value={fontWeight} onValueChange={(value) => updateProps({ fontWeight: value as TitleSubtitleProps['fontWeight'] })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="semibold">Semi Bold</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title-family" className="text-xs text-gray-600">Font Family</Label>
            <Select value={fontFamily} onValueChange={(value) => updateProps({ fontFamily: value as TitleSubtitleProps['fontFamily'] })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="sans-serif">Sans Serif</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="title-alignment" className="text-xs text-gray-600">Text Alignment</Label>
          <Select value={alignment} onValueChange={(value) => updateProps({ alignment: value as TitleSubtitleProps['alignment'] })}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="title-color" className="text-xs text-gray-600">Text Color</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="title-color"
              type="color"
              value={color}
              onChange={(e) => updateProps({ color: e.target.value })}
              className="w-16 h-9 p-1 border rounded"
            />
            <Input
              value={color}
              onChange={(e) => updateProps({ color: e.target.value })}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        {showSettings && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="title-margin-top" className="text-xs text-gray-600">Margin Top (px)</Label>
                <Input
                  id="title-margin-top"
                  type="number"
                  value={marginTop}
                  onChange={(e) => updateProps({ marginTop: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="title-margin-bottom" className="text-xs text-gray-600">Margin Bottom (px)</Label>
                <Input
                  id="title-margin-bottom"
                  type="number"
                  value={marginBottom}
                  onChange={(e) => updateProps({ marginBottom: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs text-gray-600">Enable Markdown</Label>
                <p className="text-xs text-gray-500">Allow basic markdown formatting</p>
              </div>
              <Switch
                checked={enableMarkdown}
                onCheckedChange={(checked) => updateProps({ enableMarkdown: checked })}
              />
            </div>

            {enableMarkdown && (
              <Alert>
                <Type className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Markdown enabled. You can use **bold**, *italic*, `code`, and other basic formatting.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>

      {onRemove && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="w-full"
        >
          Remove Title
        </Button>
      )}
    </div>
  );

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Type className="h-4 w-4" />
            {component.label || 'Title Element'}
            <Badge variant="secondary" className="ml-auto">
              {level.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="border rounded-lg p-4 bg-white">
            {renderTitle()}
          </div>
          {renderPropertyPanel()}
        </CardContent>
      </Card>
    );
  }

  // Live form view - just render the title
  return (
    <div className="w-full">
      {renderTitle()}
    </div>
  );
};

export default TitleElement;