import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import type { FormComponent } from "@/lib/api-form-builder";
import { FieldSelectorDialog } from "./FieldSelectorDialog";

interface LiveSummaryResponse {
  success: boolean;
  summary?: string;
  generatedAt?: string;
  error?: string;
  metadata?: {
    tokensUsed?: number;
    processingTime?: number;
  };
}

interface AISummaryElementProps {
  component: FormComponent;
  formData?: Record<string, any>;
  allComponents: FormComponent[];
  onUpdate?: (updates: Partial<FormComponent>) => void;
  isLiveForm?: boolean;
  isEditing?: boolean;
}

interface AISummaryState {
  summary: string | null;
  generatedAt: Date | null;
  sourceFields: string[];
  isGenerating: boolean;
  showFieldSelector: boolean;
  error: string | null;
  isStale: boolean;
}

export const AISummaryElement: React.FC<AISummaryElementProps> = ({
  component,
  formData = {},
  allComponents,
  onUpdate,
  isLiveForm = false,
  isEditing = false,
}) => {
  const [state, setState] = useState<AISummaryState>({
    summary: component.props?.aiSummaryData?.content || null,
    generatedAt: component.props?.aiSummaryData?.generatedAt 
      ? new Date(component.props.aiSummaryData.generatedAt) 
      : null,
    sourceFields: component.props?.aiSummaryData?.sourceFields || [],
    isGenerating: false,
    showFieldSelector: false,
    error: null,
    isStale: false,
  });

  // Mark summary as stale when source field data changes
  useEffect(() => {
    if (state.sourceFields.length > 0 && state.summary) {
      const hasChanges = state.sourceFields.some(fieldId => {
        const oldValue = component.props?.aiSummaryData?.sourceData?.[fieldId];
        const newValue = formData[fieldId];
        return JSON.stringify(oldValue) !== JSON.stringify(newValue);
      });
      
      if (hasChanges && !state.isStale) {
        setState(prev => ({ ...prev, isStale: true }));
      }
    }
  }, [formData, state.sourceFields, state.summary, component.props?.aiSummaryData?.sourceData]);

  const handleGenerateSummary = async () => {
    setState(prev => ({ ...prev, showFieldSelector: true }));
  };

  const handleFieldSelection = async (selectedFields: string[], fieldData: Record<string, any>) => {
    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      showFieldSelector: false,
      error: null 
    }));

    try {
      // Get base URL and API token
      const baseUrl = window.location.origin;
      const apiToken = localStorage.getItem('apiToken') || '';

      const response = await fetch(`${baseUrl}/api/form-summary-live`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          templateId: component.id,
          elementId: component.id,
          selectedFields,
          fieldData,
          summaryConfig: component.props?.aiSummaryConfig || {},
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data: LiveSummaryResponse = await response.json();
      
      if (data.success && data.summary) {
        const newSummaryData = {
          content: data.summary,
          generatedAt: data.generatedAt || new Date().toISOString(),
          sourceFields: selectedFields,
          sourceData: fieldData,
        };

        setState(prev => ({
          ...prev,
          summary: data.summary || null,
          generatedAt: new Date(newSummaryData.generatedAt),
          sourceFields: selectedFields,
          isGenerating: false,
          isStale: false,
        }));

        // Update the component data
        if (onUpdate) {
          onUpdate({
            props: {
              ...component.props,
              aiSummaryData: newSummaryData,
            },
          });
        }
      } else {
        throw new Error(data.error || 'Failed to generate summary');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  const renderBuilderView = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {component.label || 'AI Summary'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This AI Summary element will allow users to generate summaries from selected form fields.
              Configure the settings below to customize the summary generation.
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Configuration options:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Auto-select fields: {component.props?.aiSummaryConfig?.autoSelectFields ? 'Yes' : 'No'}</li>
              <li>Include medical context: {component.props?.aiSummaryConfig?.includeMedicalContext ? 'Yes' : 'No'}</li>
              <li>Max length: {component.props?.aiSummaryConfig?.maxLength || 'Unlimited'}</li>
              <li>Show source field labels: {component.props?.aiSummaryConfig?.sourceFieldLabels ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLiveFormView = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {component.label || 'AI Summary'}
          </span>
          {state.isStale && (
            <Badge variant="outline" className="ml-2">
              Data Changed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.summary ? (
            <>
              <Textarea
                value={state.summary}
                readOnly
                className="min-h-[150px] resize-none"
                placeholder="AI-generated summary will appear here..."
              />
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Generated {state.generatedAt?.toLocaleString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSummary}
                  disabled={state.isGenerating}
                >
                  {state.isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </>
                  )}
                </Button>
              </div>

              {state.sourceFields.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  Based on {state.sourceFields.length} field{state.sourceFields.length > 1 ? 's' : ''}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Click the button below to generate an AI summary from your form responses.
              </p>
              <Button
                onClick={handleGenerateSummary}
                disabled={state.isGenerating}
              >
                {state.isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Summary
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* Field Selector Dialog will be rendered conditionally */}
      {state.showFieldSelector && (
        <FieldSelectorDialog
          isOpen={state.showFieldSelector}
          onClose={() => setState(prev => ({ ...prev, showFieldSelector: false }))}
          allComponents={allComponents}
          formData={formData}
          preselectedFields={component.props?.aiSummaryConfig?.autoSelectFields 
            ? allComponents
                .filter(c => c.type !== 'ai_summary' && formData[c.id])
                .map(c => c.id)
            : state.sourceFields
          }
          onConfirm={handleFieldSelection}
        />
      )}
    </Card>
  );

  if (isEditing || !isLiveForm) {
    return renderBuilderView();
  }

  return renderLiveFormView();
};

export default AISummaryElement;