import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import type { FormComponent } from "@/lib/api-form-builder";

interface FormSummaryProps {
  formId: string;
  formName: string;
  formDescription?: string;
  components: FormComponent[];
  isOpen?: boolean;
  onClose?: () => void;
}

interface SummaryResponse {
  summary?: string;
  updatedAt?: string;
  generatedAt?: string;
  error?: string;
  message?: string;
}

export function FormSummary({
  formId,
  formName,
  formDescription,
  components,
  isOpen = false,
  onClose
}: FormSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  
  // Fetch existing summary on mount
  useEffect(() => {
    if (isOpen && formId !== 'new') {
      fetchSummary();
    }
  }, [isOpen, formId]);
  
  const fetchSummary = async () => {
    try {
      const response = await fetch(`/api/form-summary?formId=${formId}`);
      const data: SummaryResponse = await response.json();
      
      if (response.ok && data.summary) {
        setSummary(data.summary);
        setLastUpdated(data.updatedAt ? new Date(data.updatedAt) : null);
      }
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };
  
  const generateSummary = async () => {
    // Check if any components are selected
    if (selectedComponents.size === 0) {
      setError('Please select at least one form component to generate a summary');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Filter components based on selection
      const selectedComponentsList = components.filter(comp =>
        selectedComponents.has(comp.id)
      );
      
      const response = await fetch('/api/form-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId,
          formData: {
            name: formName,
            description: formDescription,
            components: selectedComponentsList
          }
        })
      });
      
      const data: SummaryResponse = await response.json();
      
      if (response.ok && data.summary) {
        setSummary(data.summary);
        setLastUpdated(data.generatedAt ? new Date(data.generatedAt) : new Date());
      } else {
        throw new Error(data.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleComponent = (componentId: string) => {
    setSelectedComponents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(componentId)) {
        newSet.delete(componentId);
      } else {
        newSet.add(componentId);
      }
      return newSet;
    });
  };
  
  const selectAll = () => {
    setSelectedComponents(new Set(components.map(c => c.id)));
  };
  
  const deselectAll = () => {
    setSelectedComponents(new Set());
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Form Summary</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>
          <CardDescription>
            AI-generated overview of your form structure and content
          </CardDescription>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[60vh]">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!summary && !loading && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Select form components to include in the AI summary
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h4 className="font-medium">Form Components</h4>
                  <div className="space-x-2">
                    <Button variant="ghost" size="sm" onClick={selectAll}>
                      Select All
                    </Button>
                    <Button variant="ghost" size="sm" onClick={deselectAll}>
                      Deselect All
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <Checkbox
                        id={component.id}
                        checked={selectedComponents.has(component.id)}
                        onCheckedChange={() => toggleComponent(component.id)}
                      />
                      <label
                        htmlFor={component.id}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <div className="font-medium">
                          {component.label || `${component.type} field`}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Type: {component.type}
                          {component.props?.required && ' • Required'}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 flex justify-center">
                  <Button
                    onClick={generateSummary}
                    disabled={selectedComponents.size === 0}
                  >
                    Generate Summary ({selectedComponents.size} selected)
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Generating summary...</span>
            </div>
          )}
          
          {summary && !loading && (
            <>
              <div className="prose prose-sm max-w-none">
                {summary.split('\n').map((line, index) => {
                  // Parse markdown-like formatting
                  if (line.startsWith('###')) {
                    return (
                      <h3 key={index} className="text-base font-semibold mt-4 mb-2">
                        {line.replace(/^###\s*/, '')}
                      </h3>
                    );
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={index} className="font-semibold mb-2">
                        {line.replace(/\*\*/g, '')}
                      </p>
                    );
                  } else if (line.startsWith('-')) {
                    return (
                      <li key={index} className="ml-4 mb-1">
                        {line.replace(/^-\s*/, '')}
                      </li>
                    );
                  } else if (line.trim() === '') {
                    return <br key={index} />;
                  } else {
                    return (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    );
                  }
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {lastUpdated && (
                    <>Last updated: {lastUpdated.toLocaleString()}</>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSummary(null);
                    setError(null);
                  }}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}