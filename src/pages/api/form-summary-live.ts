// API endpoint for generating AI summaries in live forms
// IPLC Forms v3

import type { APIRoute } from 'astro';
import { checkRateLimit } from '../../lib/ai/rateLimit';
import type { AIEnv } from '../../lib/ai/types';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  
  try {
    // Parse request body
    const body = await request.json() as {
      selectedFields: string[];
      fieldData: Record<string, any>;
      summaryConfig?: {
        defaultPrompt?: string;
        maxLength?: number;
        includeMedicalContext?: boolean;
        sourceFieldLabels?: boolean;
      };
    };
    const { selectedFields, fieldData, summaryConfig } = body;

    if (!selectedFields || !Array.isArray(selectedFields) || selectedFields.length === 0) {
      return new Response(JSON.stringify({ error: 'No fields selected for summary' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create AI environment object
    const aiEnv: AIEnv = {
      AI: env.AI,
      DOC_INDEX: env.DOC_INDEX,
      DOC_METADATA: env.DOC_METADATA,
      CHAT_HISTORY: env.CHAT_HISTORY || env.FORMS_KV,
      AI_GATE: env.AIGate
    };

    // Check rate limit
    const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
    const clientId = `form-summary-live:${clientIp}`;
    const rateLimitResult = await checkRateLimit(clientId, aiEnv);
    
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfter: retryAfter
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString()
        }
      });
    }

    // Extract configuration with defaults
    const {
      defaultPrompt = '',
      maxLength = 500,
      includeMedicalContext = true,
      sourceFieldLabels = true
    } = summaryConfig || {};

    // Build the content for summarization
    const contentParts: string[] = [];
    
    selectedFields.forEach(fieldId => {
      const value = fieldData[fieldId];
      if (value !== undefined && value !== null && value !== '') {
        if (sourceFieldLabels) {
          // Try to get field label from the field ID (assuming format like "fieldLabel_timestamp")
          const label = fieldId.split('_')[0]
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str: string) => str.toUpperCase())
            .trim();
          contentParts.push(`${label}: ${value}`);
        } else {
          contentParts.push(String(value));
        }
      }
    });

    if (contentParts.length === 0) {
      return new Response(JSON.stringify({ error: 'No content to summarize' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const contentToSummarize = contentParts.join('\n');

    // Build the system prompt
    let systemPrompt = 'You are a medical assistant helping to summarize form data. ';
    if (includeMedicalContext) {
      systemPrompt += 'Use appropriate medical terminology and maintain clinical accuracy. ';
    }
    systemPrompt += `Create a concise summary of the provided information in no more than ${maxLength} characters.`;

    // Build the full prompt
    let fullPrompt = '';
    if (defaultPrompt) {
      fullPrompt = `${systemPrompt}\n\n${defaultPrompt}\n\nData to summarize:\n${contentToSummarize}`;
    } else {
      fullPrompt = `${systemPrompt}\n\nPlease summarize the following form data:\n\n${contentToSummarize}`;
    }

    // Use IPLC_AI service binding
    const iplcAI = (env as any).IPLC_AI;
    if (!iplcAI || typeof iplcAI.fetch !== 'function') {
      return new Response(JSON.stringify({
        error: 'AI service not available',
        details: 'IPLC_AI service binding is not configured'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call the iplc-ai worker's /summary endpoint
    const summaryResponse = await iplcAI.fetch('https://iplc-ai.worker/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: fullPrompt,
        maxWords: maxLength
      })
    });

    if (!summaryResponse.ok) {
      const error = await summaryResponse.text();
      console.error('IPLC_AI summary error:', error);
      throw new Error(`AI service error: ${error}`);
    }

    const { summary } = await summaryResponse.json();

    if (!summary) {
      throw new Error('Failed to generate summary');
    }

    return new Response(JSON.stringify({
      summary: summary,
      generatedAt: new Date().toISOString(),
      sourceFields: selectedFields
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating AI summary:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// OPTIONS handler is now handled by CORS middleware