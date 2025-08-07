import { test, expect, request } from '@playwright/test';

test('RBAC chat route: 403 without E2E', async ({ baseURL }) => {
  const ctx = await request.newContext({ baseURL });
  const resp = await ctx.post('/api/chat/conversations', { data: { message: 'hi' } });
  expect(resp.status()).toBe(403);
});

test('RBAC chat route: bypass with x-e2e', async ({ baseURL }) => {
  const ctx = await request.newContext({
    baseURL,
    extraHTTPHeaders: { 'x-e2e': '1' }
  });
  const resp = await ctx.post('/api/chat/conversations', { data: { message: 'hi' } });
  // Bypass should return non-403; chat handler may return 200/204 depending on implementation
  expect([200, 201, 202, 204]).toContain(resp.status());
  // Optional trace header
  const bypass = resp.headers()['x-e2e-bypass'] || resp.headers()['X-E2E-Bypass'];
  // Not strictly required, but if present should include 'rbac'
  if (bypass) expect(bypass).toContain('rbac');
});