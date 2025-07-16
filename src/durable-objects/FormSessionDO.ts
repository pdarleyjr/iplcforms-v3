// FormSessionDO - Durable Object for form autosave and collaboration
// Handles real-time form state persistence and conflict resolution

interface FormSessionData {
  formData: any;
  userName: string;
  templateId: number;
  timestamp?: string;
}

interface SessionObject {
  sessionId: string;
  templateId: number;
  userName: string;
  formData: any;
  timestamp: string;
  lastModified: string;
  version: number;
}

export class FormSessionDO {
  private env: any;
  private state: DurableObjectState;
  private sessions = new Map<string, any>();

  constructor(state: DurableObjectState, env: any) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (!sessionId) {
      return new Response('Missing sessionId', { status: 400 });
    }

    switch (request.method) {
      case 'GET':
        return this.getSession(sessionId);
      case 'POST':
        return this.saveSession(sessionId, request);
      case 'DELETE':
        return this.deleteSession(sessionId);
      default:
        return new Response('Method not allowed', { status: 405 });
    }
  }

  private async getSession(sessionId: string): Promise<Response> {
    try {
      // Try to get from memory first
      let session = this.sessions.get(sessionId);
      
      if (!session) {
        // Fall back to durable storage
        session = await this.state.storage.get(sessionId);
      }

      if (!session) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Session not found' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        session
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to retrieve session'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  private async saveSession(sessionId: string, request: Request): Promise<Response> {
    try {
      const body = await request.json() as FormSessionData;
      const { formData, userName, templateId, timestamp } = body;

      // Create session object
      const session = {
        sessionId,
        templateId,
        userName,
        formData,
        timestamp: timestamp || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: (this.sessions.get(sessionId)?.version || 0) + 1
      };

      // Store in memory and durable storage
      this.sessions.set(sessionId, session);
      await this.state.storage.put(sessionId, session);

      // Set expiration (24 hours)
      await this.state.storage.setAlarm(Date.now() + 24 * 60 * 60 * 1000);

      return new Response(JSON.stringify({
        success: true,
        session,
        message: 'Session saved successfully'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to save session'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  private async deleteSession(sessionId: string): Promise<Response> {
    try {
      // Remove from memory and storage
      this.sessions.delete(sessionId);
      await this.state.storage.delete(sessionId);

      return new Response(JSON.stringify({
        success: true,
        message: 'Session deleted successfully'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to delete session'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Handle expired sessions cleanup
  async alarm(): Promise<void> {
    try {
      // Get all keys and check expiration
      const keys = await this.state.storage.list();
      const now = Date.now();
      const expiredKeys: string[] = [];

      for (const [key, session] of keys.entries()) {
        const sessionData = session as any;
        const lastModified = new Date(sessionData.lastModified).getTime();
        
        // Sessions expire after 24 hours of inactivity
        if (now - lastModified > 24 * 60 * 60 * 1000) {
          expiredKeys.push(key);
        }
      }

      // Clean up expired sessions
      if (expiredKeys.length > 0) {
        await this.state.storage.delete(expiredKeys);
        expiredKeys.forEach(key => this.sessions.delete(key));
      }

      // Set next alarm if there are still active sessions
      if (keys.size > expiredKeys.length) {
        await this.state.storage.setAlarm(Date.now() + 60 * 60 * 1000); // Check again in 1 hour
      }
    } catch (error) {
      console.error('Failed to clean up expired sessions:', error);
    }
  }
}