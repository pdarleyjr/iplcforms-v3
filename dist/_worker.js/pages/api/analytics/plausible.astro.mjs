globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as handlePlausibleProxy } from '../../../chunks/plausible-proxy_CO7DzKo-.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const ALL = async ({ request, locals }) => {
  const env = locals.runtime.env;
  try {
    return await handlePlausibleProxy(request, env);
  } catch (error) {
    console.error("Analytics proxy error:", error);
    return new Response(JSON.stringify({ error: "Analytics service error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const GET = ALL;
const POST = ALL;
const OPTIONS = ALL;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  GET,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=plausible.astro.mjs.map
