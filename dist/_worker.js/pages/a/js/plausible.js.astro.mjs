globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as handlePlausibleScript } from '../../../chunks/plausible-proxy_CO7DzKo-.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const config = {
    analyticsEnabled: env.ANALYTICS_ENABLED === "true" || env.ANALYTICS_ENABLED === true,
    plausibleDomain: env.PLAUSIBLE_DOMAIN,
    dataDomain: env.DATA_DOMAIN
  };
  return await handlePlausibleScript(request, config);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=plausible.js.astro.mjs.map
