import type { APIRoute } from 'astro';

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
  messageCount: number;
}

import { withRBAC } from '@/lib/middleware/rbac-middleware';
export const GET: APIRoute = withRBAC(['clinician','admin'], async ({ locals }) => {
  const env = (locals as any).runtime.env;
  
  try {
    // List all conversations for the user
    const { keys } = await env.CHAT_HISTORY.list({
      prefix: 'conversation:',
      limit: 1000
    });
    
    // Fetch all conversation metadata
    const conversations: Conversation[] = [];
    for (const key of keys) {
      const conversationData = await env.CHAT_HISTORY.get(key.name);
      if (conversationData) {
        try {
          const conversation = JSON.parse(conversationData);
          conversations.push(conversation);
        } catch (parseError) {
          console.error(`Failed to parse conversation ${key.name}:`, parseError);
        }
      }
    }
    
    // Sort by updated date, newest first
    conversations.sort((a, b) => 
      new Date(b.updatedAt || b.createdAt).getTime() - 
      new Date(a.updatedAt || a.createdAt).getTime()
    );
    
    return new Response(JSON.stringify({
      conversations,
      total: conversations.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to list conversations:', error);
    
    // Return empty array if no conversations exist yet
    if (error instanceof Error && error.message.includes('not found')) {
      return new Response(JSON.stringify({
        conversations: [],
        total: 0
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Failed to list conversations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export const POST: APIRoute = withRBAC(['clinician','admin'], async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  
  try {
    const data = await request.json() as { title?: string };
    const { title } = data;
    
    // Generate a unique conversation ID
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const conversation: Conversation = {
      id: conversationId,
      title: title || 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0
    };
    
    // Store the conversation
    await env.CHAT_HISTORY.put(
      `conversation:${conversationId}`,
      JSON.stringify(conversation)
    );
    
    return new Response(JSON.stringify(conversation), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to create conversation:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export const DELETE: APIRoute = withRBAC(['clinician','admin'], async ({ url, locals }) => {
  const env = (locals as any).runtime.env;
  const conversationId = url.pathname.split('/').pop();
  
  if (!conversationId) {
    return new Response(JSON.stringify({ 
      error: 'Conversation ID is required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Delete the conversation
    await env.CHAT_HISTORY.delete(`conversation:${conversationId}`);
    
    // Also delete all messages in this conversation
    const { keys } = await env.CHAT_HISTORY.list({
      prefix: `message:${conversationId}:`,
      limit: 1000
    });
    
    // Delete all messages
    for (const key of keys) {
      await env.CHAT_HISTORY.delete(key.name);
    }
    
    return new Response(JSON.stringify({ 
      message: 'Conversation deleted successfully' 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to delete conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});