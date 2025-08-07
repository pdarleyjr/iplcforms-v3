'use client';

import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
// Static CSS import so Vite bundles SurveyJS theme
// Kept at top-level (client-only component) to avoid SSR issues
// Use a locally-bundled minimal CSS to avoid Vite deep-import resolution issues.
// The file simply re-exports the SurveyJS CDN CSS.
import './survey-theme.css';

// Keep loose typing to avoid heavy imports
interface SurveyIslandProps {
  template?: any;
  surveyJson?: any; // Direct SurveyJS JSON model
  onSubmit?: (data: Record<string, unknown>) => void;
}

export default function SurveyIsland(props: SurveyIslandProps): ReactElement {
  const [Survey, setSurvey] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const loadSurvey = async () => {
      try {
        // Import SurveyJS components dynamically (JS only)
        const surveyReactUI = await import('survey-react-ui');
        setSurvey(() => surveyReactUI.Survey);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load SurveyJS:', err);
        setError('Failed to load survey component');
        setIsLoading(false);
      }
    };

    loadSurvey();
  }, []);

  // Handle survey completion
  const handleComplete = (sender: any) => {
    const results = sender.data;
    console.log('Survey completed:', results);
    
    if (props.onSubmit) {
      props.onSubmit(results);
    }
  };

  // Prepare survey model
  const getSurveyModel = () => {
    // If direct SurveyJS JSON is provided, use it
    if (props.surveyJson) {
      return props.surveyJson;
    }
    
    // If template is provided, convert it (fallback to adapter if needed)
    if (props.template) {
      try {
        // Try to use the adapter if available, but avoid ESM/CJS import issues during type-check
        // We access via dynamic import at runtime only; for type-check, fall back below.
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { toSurveyJSON } = require('../../../lib/surveyjs/adapter');
          return toSurveyJSON(props.template);
        }
        // When SSR/type-checking, avoid importing adapter
        throw new Error('SSR adapter skip');
      } catch {
        // Fallback to a simple conversion
        return {
          title: props.template.title || 'Survey',
          pages: [{
            name: 'page1',
            elements: []
          }]
        };
      }
    }

    // Default demo survey if nothing provided
    return {
      title: 'Demo Survey',
      pages: [{
        name: 'page1',
        elements: [
          {
            type: 'text',
            name: 'name',
            title: 'What is your name?',
            isRequired: true
          },
          {
            type: 'radiogroup',
            name: 'experience',
            title: 'How would you rate your experience?',
            choices: ['Excellent', 'Good', 'Fair', 'Poor'],
            isRequired: true
          },
          {
            type: 'comment',
            name: 'feedback',
            title: 'Any additional feedback?',
            rows: 4
          }
        ]
      }]
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div data-testid="survey-island" aria-label="Survey" className="p-4">
        <div className="text-center">Loading survey...</div>
      </div>
    );
  }

  // Error state
  if (error || !Survey) {
    return (
      <div data-testid="survey-island" aria-label="Survey" className="p-4">
        <div className="text-red-500">Error: {error || 'Survey component not available'}</div>
      </div>
    );
  }

  // Render survey
  const surveyJson = getSurveyModel();

  // Build a SurveyModel instance on the client to avoid mismatches
  const [model, setModel] = useState<any>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { Model } = await import('survey-core');
        if (!mounted) return;
        setModel(new Model(surveyJson));
      } catch {
        if (!mounted) return;
        // As a fallback, pass plain JSON; Survey component can handle it
        setModel(surveyJson);
      }
    })();
    return () => {
      mounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(surveyJson)]);

  return (
    <div data-testid="survey-island" aria-label="Survey" className="survey-container">
      {model ? (
        <Survey model={model} onComplete={handleComplete} />
      ) : (
        <div className="text-center">Loading survey...</div>
      )}
    </div>
  );
}