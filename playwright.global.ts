import { request } from '@playwright/test';

export default async () => {
  const base = process.env.E2E_BASE_URL || 'http://127.0.0.1:8788';
  const ctx = await request.newContext();
  const res = await ctx.get(`${base}/health`);
  if (res.status() !== 200) {
    throw new Error(`Worker not ready on ${base}; got ${res.status()}`);
  }
  await ctx.dispose();
};