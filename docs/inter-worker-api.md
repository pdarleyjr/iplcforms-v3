# Inter-Worker API Documentation

This document describes the API interface between `iplcforms-v3` and `iplc-ai` workers.

## Overview

The `iplcforms-v3` worker communicates with the `iplc-ai` worker through service bindings. The `iplc-ai` worker handles all AI-related operations including:

- Document embeddings and vector search
- Chat/RAG responses
- AI Gate concurrency management
- Document storage and retrieval

## Service Binding Configuration

### iplcforms-v3 (wrangler.toml)
```toml
[[services]]
binding = "IPLC_AI"
service = "iplc-ai"
```

## API Endpoints

### 1. Generate RAG Response
**POST** `/api/chat/query`

Generates a RAG response with context from vectorized documents.

Request:
```json
{
  "message": "string",
  "conversationId": "string (optional)",
  "documentIds": ["array of document IDs (optional)"],
  "options": {
    "maxTokens": 1000,
    "temperature": 0.7,
    "topK": 5
  }
}
```

Response: Server-sent events stream
```
data: {"type": "chunk", "content": "partial response text"}
data: {"type": "done", "metadata": {...}}
```

### 2. Store Document
**POST** `/api/documents`

Stores a document and generates embeddings.

Request:
```json
{
  "content": "string",
  "metadata": {
    "title": "string",
    "source": "string",
    "category": "string (optional)"
  }
}
```

Response:
```json
{
  "documentId": "string",
  "vectorCount": 10,
  "success": true
}
```

### 3. Search Documents
**POST** `/api/documents/search`

Searches documents using vector similarity.

Request:
```json
{
  "query": "string",
  "topK": 5,
  "filter": {
    "category": "string (optional)"
  }
}
```

Response:
```json
{
  "results": [
    {
      "documentId": "string",
      "score": 0.95,
      "content": "string",
      "metadata": {...}
    }
  ]
}
```

### 4. Check Rate Limit
**POST** `/api/rate-limit/check`

Checks if a client has exceeded rate limits.

Request:
```json
{
  "clientId": "string",
  "action": "chat|embedding"
}
```

Response:
```json
{
  "allowed": true,
  "remaining": 45,
  "resetAt": 1234567890,
  "limit": 60
}
```

### 5. AI Gate Status
**GET** `/api/ai-gate/status`

Gets the current status of AI request processing.

Response:
```json
{
  "activeRequests": 1,
  "maxConcurrent": 2,
  "queueLength": 0,
  "canAcceptMore": true
}
```

## Authentication

Inter-worker communication uses service bindings, which provide secure worker-to-worker communication without external authentication.

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request
- 429: Rate Limited
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message",
  "details": "Additional context (optional)"
}
```

## CORS Configuration

The `iplc-ai` worker includes CORS headers to allow requests from the main application:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Usage Example

From `iplcforms-v3` worker:

```typescript
// Using service binding
const response = await env.IPLC_AI.fetch(
  new Request('https://iplc-ai.workers.dev/api/chat/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'What is IPLC?',
      conversationId: 'conv-123'
    })
  })
);

// Handle streaming response
const reader = response.body.getReader();
// ... process stream