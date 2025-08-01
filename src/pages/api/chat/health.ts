import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ status: 'ok', env: 'iplcforms-v3' }),
               { headers: { 'Content-Type': 'application/json' }});