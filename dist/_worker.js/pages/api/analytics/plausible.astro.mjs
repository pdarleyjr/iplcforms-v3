globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

async function ALL(ctx) {
  const e2e = ctx.request.headers.get("x-e2e");
  const domain = ctx.env?.PLAUSIBLE_DOMAIN;
  if (e2e || !domain) return new Response(null, { status: 204 });
  try {
    const body = await ctx.request.text();
    const resp = await fetch(`https://${domain}/api/event`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body
    });
    return new Response(null, { status: resp.ok ? 204 : 502 });
  } catch {
    return new Response(null, { status: 204 });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=plausible.astro.mjs.map
