import type { APIRoute } from 'astro';
import type { AIEnv } from '../../lib/ai/types';

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any).runtime.env as unknown as AIEnv;
  
  try {
    const results = {
      timestamp: new Date().toISOString(),
      bindings: {
        // Check if IPLC_AI service binding exists
        hasIPLC_AI: !!(env as any).IPLC_AI,
        IPLC_AI_type: typeof (env as any).IPLC_AI,
        IPLC_AI_hasFetch: typeof (env as any).IPLC_AI?.fetch === 'function',
        
        // Check local bindings
        hasAI: !!env.AI,
        hasDOC_INDEX: !!env.DOC_INDEX,
        hasCHAT_HISTORY: !!env.CHAT_HISTORY,
        hasAI_GATE: !!env.AI_GATE,
        
        // List all env keys
        envKeys: Object.keys(env || {})
      },
      serviceTest: null as any
    };
    
    // Test IPLC_AI service binding if available
    if ((env as any).IPLC_AI && typeof (env as any).IPLC_AI.fetch === 'function') {
      try {
        const testResponse = await (env as any).IPLC_AI.fetch('https://iplc-ai.worker/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        results.serviceTest = {
          success: true,
          status: testResponse.status,
          statusText: testResponse.statusText,
          headers: Object.fromEntries(testResponse.headers.entries()),
          body: await testResponse.text()
        };
      } catch (error) {
        results.serviceTest = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    } else {
      results.serviceTest = {
        success: false,
        error: 'IPLC_AI service binding not available'
      };
    }
    
    return new Response(JSON.stringify(results, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Test AI binding error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to test AI binding',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};