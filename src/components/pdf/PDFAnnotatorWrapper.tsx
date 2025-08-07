import React, { useState, useEffect, useCallback } from 'react';
import PDFHighlighterClient from './PDFHighlighterClient';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  FileText, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight,
  Highlighter,
  MessageSquare,
  Trash2,
  Save,
  Loader2
} from 'lucide-react';

// Types for annotations
export interface PDFAnnotation {
  id: string;
  content: {
    text?: string;
    image?: string;
  };
  position: any;
  comment?: {
    text: string;
    emoji?: string;
  };
  color?: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
  author?: string;
}

interface PDFAnnotatorWrapperProps {
  pdfUrl?: string;
  pdfFile?: File;
  initialAnnotations?: PDFAnnotation[];
  onAnnotationsChange?: (annotations: PDFAnnotation[]) => void;
  onSave?: (annotations: PDFAnnotation[]) => Promise<void>;
  readOnly?: boolean;
  showToolbar?: boolean;
  height?: string;
  className?: string;
}

// Color palette for highlights
const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#ffeb3b', rgba: 'rgba(255, 235, 59, 0.4)' },
  { name: 'Green', value: '#4caf50', rgba: 'rgba(76, 175, 80, 0.4)' },
  { name: 'Blue', value: '#2196f3', rgba: 'rgba(33, 150, 243, 0.4)' },
  { name: 'Pink', value: '#e91e63', rgba: 'rgba(233, 30, 99, 0.4)' },
  { name: 'Purple', value: '#9c27b0', rgba: 'rgba(156, 39, 176, 0.4)' },
];

export default function PDFAnnotatorWrapper({
  pdfUrl,
  pdfFile,
  initialAnnotations = [],
  onAnnotationsChange,
  onSave,
  readOnly = false,
  showToolbar = true,
  height = '800px',
  className = ''
}: PDFAnnotatorWrapperProps) {
  const [highlights, setHighlights] = useState<PDFAnnotation[]>(initialAnnotations);
  const [selectedColor, setSelectedColor] = useState(HIGHLIGHT_COLORS[0]);
  const [scale, setScale] = useState(1.0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // Handle file to blob URL conversion
  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile);
      setPdfBlobUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (pdfUrl) {
      setPdfBlobUrl(pdfUrl);
    }
  }, [pdfFile, pdfUrl]);

  // Update parent when annotations change
  useEffect(() => {
    onAnnotationsChange?.(highlights);
  }, [highlights, onAnnotationsChange]);

  const handleHighlightAdd = useCallback((highlight: any) => {
    if (readOnly) return;
    
    const newHighlight: PDFAnnotation = {
      ...highlight,
      color: selectedColor.value,
      createdAt: new Date().toISOString(),
    };
    
    setHighlights(prev => [...prev, newHighlight]);
  }, [readOnly, selectedColor]);

  const handleHighlightUpdate = useCallback((highlightId: string, updates: Partial<PDFAnnotation>) => {
    if (readOnly) return;

    setHighlights(prev => 
      prev.map(h => 
        h.id === highlightId 
          ? { ...h, ...updates, updatedAt: new Date().toISOString() }
          : h
      )
    );
  }, [readOnly]);

  const handleHighlightDelete = useCallback((highlightId: string) => {
    if (readOnly) return;

    setHighlights(prev => prev.filter(h => h.id !== highlightId));
    setSelectedHighlight(null);
  }, [readOnly]);

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(highlights);
    } catch (err) {
      setError('Failed to save annotations');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const exportAnnotations = () => {
    const dataStr = JSON.stringify(highlights, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `annotations-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importAnnotations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as PDFAnnotation[];
        setHighlights(imported);
      } catch (err) {
        setError('Failed to import annotations');
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  const scrollToHighlight = (highlight: PDFAnnotation) => {
    setSelectedHighlight(highlight.id);
    const el = document.getElementById(highlight.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!pdfBlobUrl) {
    return (
      <Alert>
        <AlertDescription>
          No PDF file or URL provided. Please provide a PDF to annotate.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`pdf-annotator-wrapper ${className}`}>
      {showToolbar && (
        <Card className="mb-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Color Selector */}
            {!readOnly && (
              <div className="flex items-center gap-2">
                <Highlighter className="w-4 h-4" />
                <span className="text-sm font-medium">Color:</span>
                <div className="flex gap-1">
                  {HIGHLIGHT_COLORS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded border-2 transition-all ${
                        selectedColor.value === color.value 
                          ? 'border-gray-800 scale-110' 
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={scale >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[80px] text-center">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onSave && !readOnly && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="ml-2">Save</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={exportAnnotations}
                disabled={highlights.length === 0}
              >
                <Download className="w-4 h-4" />
                <span className="ml-2">Export</span>
              </Button>

              {!readOnly && (
                <>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importAnnotations}
                    className="hidden"
                    id="import-annotations"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('import-annotations')?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="ml-2">Import</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      )}

      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4" style={{ height }}>
        {/* PDF Viewer */}
        <Card className="flex-1 overflow-hidden">
          <PDFHighlighterClient
            pdfUrl={pdfBlobUrl}
            highlights={highlights as any}
            onAddHighlight={handleHighlightAdd}
            onUpdateHighlight={handleHighlightUpdate}
            onDeleteHighlight={handleHighlightDelete}
            selectedColor={selectedColor}
            scale={scale}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onTotalPagesChange={setTotalPages}
            readOnly={readOnly}
          />
        </Card>

        {/* Annotations Sidebar */}
        <Card className="w-80">
          <Tabs defaultValue="annotations" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="annotations">
                <MessageSquare className="w-4 h-4 mr-2" />
                Annotations
              </TabsTrigger>
              <TabsTrigger value="details">
                <FileText className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="annotations" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4">
                {highlights.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No annotations yet</p>
                    {!readOnly && (
                      <p className="text-xs mt-2">
                        Select text to add highlights
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {highlights.map((highlight) => (
                      <div
                        key={highlight.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedHighlight === highlight.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => scrollToHighlight(highlight)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ 
                              backgroundColor: highlight.color || HIGHLIGHT_COLORS[0].value 
                            }}
                          />
                          {!readOnly && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleHighlightDelete(highlight.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        
                        {highlight.content.text && (
                          <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                            "{highlight.content.text}"
                          </p>
                        )}
                        
                        {highlight.comment && (
                          <div className="bg-gray-50 rounded p-2">
                            <p className="text-xs text-gray-600">
                              {highlight.comment.text}
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-2 text-xs text-gray-500">
                          {new Date(highlight.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="details" className="flex-1 p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Annotations</span>
                      <Badge>{highlights.length}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pages</span>
                      <Badge>{totalPages}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Color Distribution</h3>
                  <div className="space-y-2">
                    {HIGHLIGHT_COLORS.map(color => {
                      const count = highlights.filter(h => h.color === color.value).length;
                      const percentage = highlights.length > 0 
                        ? (count / highlights.length) * 100 
                        : 0;
                      
                      return (
                        <div key={color.value} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: color.value }}
                              />
                              <span className="text-gray-600">{color.name}</span>
                            </div>
                            <span>{count}</span>
                          </div>
                          <Progress value={percentage} className="h-1" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}