globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../chunks/_@astro-renderers_DXs7ZzLR.mjs';

const prerender = false;
async function GET() {
  return new Response("ok", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=health.astro.mjs.map
