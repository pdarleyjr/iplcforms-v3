export async function ALL(ctx: any): Promise<Response> {
  // If E2E or no PLAUSIBLE_DOMAIN configured, return 204 to avoid failures
  const e2e = ctx.request.headers.get('x-e2e');
  const domain = ctx.env?.PLAUSIBLE_DOMAIN;
  if (e2e || !domain) return new Response(null, { status: 204 });
  // Forward JSON body to Plausible API
  try {
    const body = await ctx.request.text();
    const resp = await fetch(`https://${domain}/api/event`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body
    });
    return new Response(null, { status: resp.ok ? 204 : 502 });
  } catch {
    return new Response(null, { status: 204 });
  }
}