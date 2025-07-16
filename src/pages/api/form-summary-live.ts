// API endpoint for generating AI summaries in live forms
// IPLC Forms v3

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiApiKey = import.meta.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

export const POST: APIRoute = async ({ request }) => {
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

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: Math.ceil(maxLength / 4), // Rough estimate of tokens from characters
      temperature: 0.3, // Lower temperature for more consistent summaries
    });

    const summary = completion.choices[0]?.message?.content || 'Unable to generate summary';

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