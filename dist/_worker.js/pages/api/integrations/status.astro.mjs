globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const GET = async ({ locals }) => {
  try {
    const runtime = locals.runtime;
    const env = runtime.env;
    const [nextcloud, slack, email, webhook] = await Promise.all([
      env.CACHE_KV.get("integration:nextcloud:config"),
      env.CACHE_KV.get("integration:slack:config"),
      env.CACHE_KV.get("integration:email:config"),
      env.CACHE_KV.get("integration:webhook:config")
    ]);
    const status = {
      nextcloud: !!nextcloud,
      slack: !!slack,
      email: !!email,
      webhook: !!webhook
    };
    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching integration status:", error);
    return new Response(JSON.stringify({
      nextcloud: false,
      slack: false,
      email: false,
      webhook: false
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=status.astro.mjs.map
