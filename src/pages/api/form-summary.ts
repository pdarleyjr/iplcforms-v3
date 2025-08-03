import type { APIRoute } from 'astro';
import { z } from 'zod';
import { generateSummary } from '../../lib/ai/chatEngine';
import { checkRateLimit } from '../../lib/ai/rateLimit';
import type { AIEnv } from '../../lib/ai/types';

const SummaryRequestSchema = z.object({
  formId: z.string(),
  formData: z.object({
    name: z.string(),
    description: z.string().optional(),
    components: z.array(z.any()),
    responses: z.record(z.string(), z.any()).optional()
  })
});

// Generate AI summary for form
export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  
  try {
    const body = await request.json();
    const validation = SummaryRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: 'Invalid request data',
        details: validation.error.issues
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { formId, formData } = validation.data;
    
    // Check if any components were provided
    if (!formData.components || formData.components.length === 0) {
      return new Response(JSON.stringify({
        error: 'No form components selected',
        message: 'Please select at least one form component to generate a summary'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create AI environment object
    const aiEnv: AIEnv = {
      AI: env.AI,
      DOC_INDEX: env.DOC_INDEX,
      DOC_METADATA: env.DOC_METADATA,
      CHAT_HISTORY: env.CHAT_HISTORY || env.FORMS_KV, // Use FORMS_KV if CHAT_HISTORY not available
      AI_GATE: env.AIGate
    };
    
    // Check rate limit
    const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
    const clientId = `form-summary:${clientIp}`;
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
    
    // Prepare content for summarization
    const contentToSummarize = `Form Analysis Request

Form Name: ${formData.name}
${formData.description ? `Form Description: ${formData.description}` : ''}

Form Components:
${formData.components.map((comp: any, index: number) => {
  return `${index + 1}. Field Type: ${comp.type}
   Label: ${comp.label || 'Unlabeled'}
   ${comp.props?.required ? '(Required)' : '(Optional)'}
   ${comp.props?.placeholder ? `Placeholder: ${comp.props.placeholder}` : ''}
   ${comp.props?.helpText ? `Help Text: ${comp.props.helpText}` : ''}`;
}).join('\n\n')}

Please provide a structured summary that includes:
- Overview of the form's purpose
- Total number of fields and breakdown by type
- Required vs optional fields
- Key features or special components
- Any clinical or domain-specific elements (if applicable)
- Accessibility considerations
- Suggestions for improvement (if any)

Format the summary using markdown with clear sections.`;
    
    // Generate AI summary
    const summary = await generateSummary(
      contentToSummarize,
      aiEnv,
      500 // Max words for summary
    );
    
    if (!summary) {
      throw new Error('Failed to generate summary');
    }
    
    // Store summary in database
    const now = new Date().toISOString();
    await env.DB.prepare(
      'UPDATE form_templates SET summary = ?, updated_at = ? WHERE id = ?'
    ).bind(summary, now, formId).run();
    
    return new Response(JSON.stringify({
      success: true,
      summary,
      generatedAt: now
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error generating form summary:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate form summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Get form summary
export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  
  try {
    const url = new URL(request.url);
    const formId = url.searchParams.get('formId');
    
    if (!formId) {
      return new Response(JSON.stringify({
        error: 'formId parameter is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await env.DB.prepare(
      'SELECT summary, updated_at FROM form_templates WHERE id = ?'
    ).bind(formId).first();
    
    if (!result || !result.summary) {
      return new Response(JSON.stringify({
        summary: null,
        message: 'No summary available'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      summary: result.summary,
      updatedAt: result.updated_at
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error fetching form summary:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch form summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};