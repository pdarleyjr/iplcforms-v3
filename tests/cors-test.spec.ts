import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:4321';

test.describe('CORS Configuration Tests', () => {
  test('should allow requests from allowed origins', async ({ request }) => {
    const allowedOrigins = [
      'https://iplcforms.com',
      'https://www.iplcforms.com',
      'https://app.iplcforms.com',
      'http://localhost:3000',
      'http://localhost:4321',
    ];

    for (const origin of allowedOrigins) {
      const response = await request.get(`${API_BASE_URL}/api/dashboard/overview`, {
        headers: {
          'Origin': origin,
        },
      });

      // Should get a successful response
      expect(response.ok()).toBeTruthy();
      
      // Should have CORS headers
      const headers = response.headers();
      expect(headers['access-control-allow-origin']).toBe(origin);
      expect(headers['access-control-allow-credentials']).toBe('true');
      expect(headers['vary']).toContain('Origin');
    }
  });

  test('should reject requests from unauthorized origins', async ({ request }) => {
    const unauthorizedOrigins = [
      'https://malicious-site.com',
      'http://evil.com',
      'https://attacker.org',
    ];

    for (const origin of unauthorizedOrigins) {
      const response = await request.get(`${API_BASE_URL}/api/dashboard/overview`, {
        headers: {
          'Origin': origin,
        },
      });

      // Should still get the response (CORS is enforced by browser)
      expect(response.ok()).toBeTruthy();
      
      // But should NOT have CORS headers
      const headers = response.headers();
      expect(headers['access-control-allow-origin']).toBeUndefined();
    }
  });

  test('should handle preflight requests correctly for allowed origins', async ({ request }) => {
    const origin = 'https://iplcforms.com';
    
    const response = await request.fetch(`${API_BASE_URL}/api/form-summary-live`, {
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
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
  });

  test('should reject preflight requests from unauthorized origins', async ({ request }) => {
    const origin = 'https://malicious-site.com';
    
    const response = await request.fetch(`${API_BASE_URL}/api/form-summary-live`, {
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });

    expect(response.status()).toBe(403);
    expect(await response.text()).toContain('CORS policy: Origin not allowed');
    
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeUndefined();
  });

  test('should not have wildcard origins in any API responses', async ({ request }) => {
    const apiEndpoints = [
      '/api/dashboard/overview',
      '/api/form-summary-live',
    ];

    for (const endpoint of apiEndpoints) {
      const response = await request.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Origin': 'https://iplcforms.com',
        },
      });

      const headers = response.headers();
      // Should never have wildcard origin
      expect(headers['access-control-allow-origin']).not.toBe('*');
    }
  });

  test('should include Vary: Origin header', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/dashboard/overview`, {
      headers: {
        'Origin': 'https://iplcforms.com',
      },
    });

    const headers = response.headers();
    expect(headers['vary']).toContain('Origin');
  });
});