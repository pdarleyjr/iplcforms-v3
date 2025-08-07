import type { APIRoute } from 'astro';

export const runtime = 'edge';

interface ExportRequest {
  conversationId: string;
  format: 'markdown' | 'json';
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Array<{
    id: number;
    documentName: string;
    text: string;
    score: number;
  }>;
}

import { withRBAC } from '@/lib/middleware/rbac-middleware';
export const POST: APIRoute = withRBAC(['clinician','admin'], async ({ request, locals }) => {
  try {
    const { env } = locals.runtime;
    const body = await request.json() as ExportRequest;
    
    if (!body.conversationId) {
      return new Response(JSON.stringify({ 
        error: 'Conversation ID is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Retrieve conversation history from KV
    const historyData = await env.KV.get(`chat:history:${body.conversationId}`);
    
    if (!historyData) {
      return new Response(JSON.stringify({ 
        error: 'Conversation not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const messages: Message[] = JSON.parse(historyData);
    
    if (body.format === 'json') {
      // Return raw JSON format
      return new Response(JSON.stringify({
        conversationId: body.conversationId,
        exportedAt: new Date().toISOString(),
        messages
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="conversation-${body.conversationId}.json"`
        }
      });
    }
    
    // Generate Markdown format
    let markdown = `# AI Chat Conversation\n\n`;
    markdown += `**Exported:** ${new Date().toLocaleString()}\n`;
    markdown += `**Conversation ID:** ${body.conversationId}\n\n`;
    markdown += `---\n\n`;
    
    // Process each message
    messages.forEach((message, index) => {
      const timestamp = new Date(message.timestamp).toLocaleTimeString();
      
      if (message.role === 'user') {
        markdown += `## 👤 User (${timestamp})\n\n`;
        markdown += `${message.content}\n\n`;
      } else {
        markdown += `## 🤖 AI Assistant (${timestamp})\n\n`;
        
        // Replace citation markers with markdown footnotes
        let content = message.content;
        const footnotes: string[] = [];
        
        if (message.citations && message.citations.length > 0) {
          content = content.replace(/\^\[(\d+)\]/g, (match, num) => {
            const citation = message.citations?.find(c => c.id === parseInt(num));
            if (citation) {
              footnotes.push(`[^${num}]: From "${citation.documentName}" - ${citation.text.substring(0, 200)}...`);
              return `[^${num}]`;
            }
            return match;
          });
        }
        
        markdown += `${content}\n\n`;
        
        // Add footnotes if any
        if (footnotes.length > 0) {
          markdown += `### Sources\n\n`;
          footnotes.forEach(footnote => {
            markdown += `${footnote}\n\n`;
          });
        }
      }
      
      // Add separator between Q&A pairs
      if (index < messages.length - 1) {
        markdown += `---\n\n`;
      }
    });
    
    // Return markdown file
    return new Response(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="conversation-${body.conversationId}.md"`
      }
    });
    
  } catch (error) {
    console.error('Error exporting conversation:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to export conversation' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// GET endpoint to retrieve available export formats
export const GET: APIRoute = withRBAC(['clinician','admin'], async () => {
  return new Response(JSON.stringify({
    formats: [
      {
        id: 'markdown',
        name: 'Markdown',
        extension: '.md',
        mimeType: 'text/markdown'
      },
      {
        id: 'json',
        name: 'JSON',
        extension: '.json',
        mimeType: 'application/json'
      }
    ]
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
});