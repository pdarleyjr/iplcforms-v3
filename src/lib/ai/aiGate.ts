/**
 * AIGate Durable Object for managing concurrent AI requests
 * Reference: "Single-Worker RAG Implementation.txt" - AIGate Durable Object
 * 
 * Enforces the 2 concurrent AI jobs limit for free tier
 */

export class AIGate {
  private state: DurableObjectState;
  private activeRequests: Map<string, number>;
  private requestQueue: Array<{
    id: string;
    resolve: () => void;
    timestamp: number;
  }>;

  // Free tier limit: 2 concurrent AI jobs
  private readonly MAX_CONCURRENT_REQUESTS = 2;
  // Timeout for stuck requests (30 seconds)
  private readonly REQUEST_TIMEOUT = 30000;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.activeRequests = new Map();
    this.requestQueue = [];
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    try {
      switch (url.pathname) {
        case '/acquire':
          return this.handleAcquire(request);
        case '/release':
          return this.handleRelease(request);
        case '/status':
          return this.handleStatus();
        default:
          return new Response('Not found', { status: 404 });
      }
    } catch (error) {
      console.error('AIGate error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      return new Response(
        JSON.stringify({ error: errorMessage }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  /**
   * Acquire a slot for AI processing
   * Reference: "Single-Worker RAG Implementation.txt" - Concurrency Management
   */
  private async handleAcquire(request: Request): Promise<Response> {
    const data = await request.json() as any;
    const { requestId } = data;
    
    if (!requestId) {
      return new Response(
        JSON.stringify({ error: 'Request ID required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Clean up timed-out requests
    await this.cleanupTimedOutRequests();

    // Check if we can process immediately
    if (this.activeRequests.size < this.MAX_CONCURRENT_REQUESTS) {
      this.activeRequests.set(requestId, Date.now());
      
      return new Response(
        JSON.stringify({ 
          acquired: true,
          activeCount: this.activeRequests.size,
          queueLength: this.requestQueue.length
        }),
        { 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Add to queue and wait
    return new Promise((resolve) => {
      this.requestQueue.push({
        id: requestId,
        resolve: () => {
          this.activeRequests.set(requestId, Date.now());
          resolve(new Response(
            JSON.stringify({ 
              acquired: true,
              activeCount: this.activeRequests.size,
              queueLength: this.requestQueue.length,
              wasQueued: true
            }),
            { 
              headers: { 'Content-Type': 'application/json' }
            }
          ));
        },
        timestamp: Date.now()
      });

      // Set a timeout to prevent indefinite waiting
      setTimeout(() => {
        const index = this.requestQueue.findIndex(item => item.id === requestId);
        if (index !== -1) {
          this.requestQueue.splice(index, 1);
          resolve(new Response(
            JSON.stringify({ 
              error: 'Request timed out waiting for AI slot',
              acquired: false
            }),
            { 
              status: 408,
              headers: { 'Content-Type': 'application/json' }
            }
          ));
        }
      }, this.REQUEST_TIMEOUT);
    });
  }

  /**
   * Release a slot after AI processing
   * Reference: "Single-Worker RAG Implementation.txt" - Concurrency Management
   */
  private async handleRelease(request: Request): Promise<Response> {
    const data = await request.json() as any;
    const { requestId } = data;
    
    if (!requestId) {
      return new Response(
        JSON.stringify({ error: 'Request ID required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Remove from active requests
    const wasActive = this.activeRequests.delete(requestId);
    
    if (!wasActive) {
      return new Response(
        JSON.stringify({ 
          error: 'Request ID not found in active requests',
          released: false
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Process next queued request if any
    if (this.requestQueue.length > 0) {
      const next = this.requestQueue.shift();
      if (next) {
        next.resolve();
      }
    }

    return new Response(
      JSON.stringify({ 
        released: true,
        activeCount: this.activeRequests.size,
        queueLength: this.requestQueue.length
      }),
      { 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  /**
   * Get current status of the AI gate
   */
  private async handleStatus(): Promise<Response> {
    await this.cleanupTimedOutRequests();

    return new Response(
      JSON.stringify({
        activeRequests: this.activeRequests.size,
        maxConcurrent: this.MAX_CONCURRENT_REQUESTS,
        queueLength: this.requestQueue.length,
        canAcceptMore: this.activeRequests.size < this.MAX_CONCURRENT_REQUESTS,
        activeRequestIds: Array.from(this.activeRequests.keys()),
        queuedRequestIds: this.requestQueue.map(item => item.id)
      }),
      { 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  /**
   * Clean up requests that have timed out
   */
  private async cleanupTimedOutRequests(): Promise<void> {
    const now = Date.now();
    const timedOutIds: string[] = [];

    // Check active requests
    for (const [id, timestamp] of this.activeRequests) {
      if (now - timestamp > this.REQUEST_TIMEOUT) {
        timedOutIds.push(id);
      }
    }

    // Remove timed out requests
    for (const id of timedOutIds) {
      this.activeRequests.delete(id);
      console.warn(`Cleaned up timed-out request: ${id}`);
    }

    // Clean up old queued requests
    this.requestQueue = this.requestQueue.filter(
      item => now - item.timestamp <= this.REQUEST_TIMEOUT
    );

    // Process queued requests if slots are available
    while (this.activeRequests.size < this.MAX_CONCURRENT_REQUESTS && this.requestQueue.length > 0) {
      const next = this.requestQueue.shift();
      if (next) {
        next.resolve();
      }
    }
  }
}

/**
 * Helper function to acquire AI processing slot
 * Reference: "Single-Worker RAG Implementation.txt" - AIGate Usage
 */
export async function acquireAISlot(
  requestId: string,
  env: { AI_GATE: DurableObjectNamespace }
): Promise<boolean> {
  try {
    const id = env.AI_GATE.idFromName('singleton');
    const gate = env.AI_GATE.get(id);
    
    const response = await gate.fetch(
      new Request('http://internal/acquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      })
    );

    const result = await response.json() as { acquired: boolean };
    return result.acquired;
  } catch (error) {
    console.error('Error acquiring AI slot:', error);
    return false;
  }
}

/**
 * Helper function to release AI processing slot
 * Reference: "Single-Worker RAG Implementation.txt" - AIGate Usage
 */
export async function releaseAISlot(
  requestId: string,
  env: { AI_GATE: DurableObjectNamespace }
): Promise<void> {
  try {
    const id = env.AI_GATE.idFromName('singleton');
    const gate = env.AI_GATE.get(id);
    
    await gate.fetch(
      new Request('http://internal/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      })
    );
  } catch (error) {
    console.error('Error releasing AI slot:', error);
  }
}

/**
 * Get AIGate status
 */
export async function getAIGateStatus(
  env: { AI_GATE: DurableObjectNamespace }
): Promise<any> {
  try {
    const id = env.AI_GATE.idFromName('singleton');
    const gate = env.AI_GATE.get(id);
    
    const response = await gate.fetch(
      new Request('http://internal/status', {
        method: 'GET'
      })
    );

    return await response.json();
  } catch (error) {
    console.error('Error getting AI gate status:', error);
    return null;
  }
}