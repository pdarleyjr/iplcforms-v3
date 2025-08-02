import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ status: "ok", env: "iplcforms-v3" }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ status: "ok", env: "iplcforms-v3" }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};