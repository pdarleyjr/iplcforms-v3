import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const runtime = locals.runtime as any;
    const env = runtime.env;
    
    // Validate request
    const data = await request.json() as any;
    
    if (!data || typeof data !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { slackWebhook, slackChannel } = data;
    
    if (!slackWebhook) {
      return new Response(JSON.stringify({ error: 'Webhook URL is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate webhook URL format
    if (!slackWebhook.startsWith('https://hooks.slack.com/services/')) {
      return new Response(JSON.stringify({ error: 'Invalid Slack webhook URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Store configuration
    const config = {
      channel: slackChannel || null,
      configured: true,
      updatedAt: new Date().toISOString()
    };
    
    await env.CACHE_KV.put('integration:slack:config', JSON.stringify(config), {
      expirationTtl: 365 * 24 * 60 * 60 // 1 year
    });
    
    // Store webhook URL separately for security
    await env.CACHE_KV.put('integration:slack:webhook', slackWebhook, {
      expirationTtl: 365 * 24 * 60 * 60 // 1 year
    });
    
    // Test the webhook
    try {
      const testPayload = {
        text: '✅ IPLC Forms Slack integration configured successfully!',
        channel: slackChannel || undefined
      };
      
      const testResponse = await fetch(slackWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testPayload)
      });
      
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        throw new Error(`Webhook test failed: ${errorText}`);
      }
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Failed to send test message. Please check your webhook URL.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      message: 'Slack configuration saved and test message sent!' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error saving Slack configuration:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save configuration' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Helper function to send Slack notification for form submission
export async function sendSlackNotification(env: any, formTitle: string, submissionId: string | number, formData: any) {
  const webhookUrl = await env.get('integration:slack:webhook');
  if (!webhookUrl) {
    return null; // Integration not configured
  }
  
  // Format the message
  const message = {
    text: `New form submission: ${formTitle}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `📋 ${formTitle}`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Submission ID:*\n${submissionId}`
          },
          {
            type: 'mrkdwn',
            text: `*Submitted:*\n${new Date().toLocaleString()}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Form Data Summary:*'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: Object.entries(formData)
            .slice(0, 10) // Limit to first 10 fields
            .map(([key, value]) => `• *${key}:* ${value}`)
            .join('\n')
        }
      }
    ]
  };
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message)
  });
  
  if (!response.ok) {
    throw new Error(`Slack notification failed: ${response.status}`);
  }
  
  return { success: true };
}

export const GET: APIRoute = async ({ locals }) => {
  try {
    const runtime = locals.runtime as any;
    const env = runtime.env;
    
    const config = await env.CACHE_KV.get('integration:slack:config');
    if (!config) {
      return new Response(JSON.stringify({ configured: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(config, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error fetching Slack configuration:', error);
    return new Response(JSON.stringify({ configured: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};