// API endpoint for generating AI summaries in live forms
// IPLC Forms v3

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    // Build the user prompt
    let userPrompt = '';
    if (defaultPrompt) {
      userPrompt = `${defaultPrompt}\n\nData to summarize:\n${contentToSummarize}`;
    } else {
      userPrompt = `Please summarize the following form data:\n\n${contentToSummarize}`;
    }

    // Call AI Worker service
    const aiPrompt = {
      systemPrompt,
      userPrompt
    };
    
    const aiResponse = await env.AI_WORKER.fetch(new Request('https://ai-worker/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aiPrompt)
    }));
    
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`AI Worker error: ${aiResponse.status} - ${errorText}`);
    }
    
    const aiResult = await aiResponse.json();
    const summary = aiResult.response || aiResult.text || aiResult.summary || 'Unable to generate summary';

    // Truncate if needed
    const truncatedSummary = summary.length > maxLength 
      ? summary.substring(0, maxLength - 3) + '...'
      : summary;

    // Log summary generation for audit purposes
    await supabase.from('ai_summary_logs').insert({
      user_id: user.id,
      summary_content: truncatedSummary,
      source_fields: selectedFields,
      field_count: selectedFields.length,
      config: summaryConfig,
      created_at: new Date().toISOString()
    });

    return new Response(JSON.stringify({
      summary: truncatedSummary,
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

// OPTIONS handler for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
};