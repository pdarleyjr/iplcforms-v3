import { test, expect, request as pwRequest } from '@playwright/test';
import { BASE_URL } from './helpers/env';

test.describe('CORS Configuration Tests', () => {
  test('should allow requests from allowed origins', async () => {
    const api = await pwRequest.newContext({ baseURL: BASE_URL });
    const allowedOrigins = [
      'https://iplcforms.com',
      'https://www.iplcforms.com',
      'https://app.iplcforms.com',
      'http://localhost:3000',
      'http://127.0.0.1:8788',
    ];

    for (const origin of allowedOrigins) {
      const response = await api.get(`/api/dashboard/overview?e2e=1`, {
        headers: {
          'Origin': origin,
          'X-Environment': 'development',
          'x-e2e': '1'
        },
      });

      expect(response.ok()).toBeTruthy();
      const headers = response.headers();
      expect(headers['access-control-allow-origin']).toBe(origin);
      expect(headers['access-control-allow-credentials']).toBe('true');
      expect(headers['vary']).toContain('Origin');
    }
    await api.dispose();
  });

  test('should reject requests from unauthorized origins', async () => {
    const api = await pwRequest.newContext({ baseURL: BASE_URL });
    const unauthorizedOrigins = [
      'https://malicious-site.com',
      'http://evil.com',
      'https://attacker.org',
    ];

    for (const origin of unauthorizedOrigins) {
      const response = await api.get(`/api/dashboard/overview?e2e=1`, {
        headers: {
          'Origin': origin,
          'X-Environment': 'development',
          'x-e2e': '1'
        },
      });

      expect(response.ok()).toBeTruthy();
      const headers = response.headers();
      expect(headers['access-control-allow-origin']).toBeUndefined();
    }
    await api.dispose();
  });

  test('should handle preflight requests correctly for allowed origins', async () => {
    const api = await pwRequest.newContext({ baseURL: BASE_URL });
    const origin = 'https://iplcforms.com';
    
    const response = await api.fetch(`/api/form-summary-live?e2e=1`, {
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
        'X-Environment': 'development',
        'x-e2e': '1'
      },
    });

    expect(response.status()).toBe(204);
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBe(origin);
    expect(headers['access-control-allow-methods']).toContain('POST');
    expect(headers['access-control-allow-headers']).toContain('Content-Type');
    expect(headers['access-control-allow-headers']).toContain('Authorization');
    expect(headers['access-control-max-age']).toBe('86400');
    expect(headers['access-control-allow-credentials']).toBe('true');
    await api.dispose();
  });

  test('should reject preflight requests from unauthorized origins', async () => {
    const api = await pwRequest.newContext({ baseURL: BASE_URL });
    const origin = 'https://malicious-site.com';
    
    const response = await api.fetch(`/api/form-summary-live?e2e=1`, {
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
        'X-Environment': 'development',
        'x-e2e': '1'
      },
    });

    expect(response.status()).toBe(403);
    expect(await response.text()).toContain('CORS policy: Origin not allowed');
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeUndefined();
    await api.dispose();
  });

  test('should not have wildcard origins in any API responses', async () => {
    const api = await pwRequest.newContext({ baseURL: BASE_URL });
    const apiEndpoints = [
      '/api/dashboard/overview',
      '/api/form-summary-live',
    ];

    for (const endpoint of apiEndpoints) {
      const response = await api.get(`${endpoint}?e2e=1`, {
        headers: {
          'Origin': 'https://iplcforms.com',
          'X-Environment': 'development',
          'x-e2e': '1'
        },
      });

      const headers = response.headers();
      expect(headers['access-control-allow-origin']).not.toBe('*');
    }
    await api.dispose();
  });

  test('should include Vary: Origin header', async () => {
    const api = await pwRequest.newContext({ baseURL: BASE_URL });
    const response = await api.get(`/api/dashboard/overview?e2e=1`, {
      headers: {
        'Origin': 'https://iplcforms.com',
        'X-Environment': 'development',
        'x-e2e': '1'
      },
    });

    const headers = response.headers();
    expect(headers['vary']).toContain('Origin');
    await api.dispose();
  });
});