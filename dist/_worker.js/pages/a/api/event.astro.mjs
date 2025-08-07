globalThis.process ??= {}; globalThis.process.env ??= {};
import { h as handlePlausibleEvent } from '../../../chunks/plausible-proxy_CO7DzKo-.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const POST = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const config = {
    analyticsEnabled: env.ANALYTICS_ENABLED === "true" || env.ANALYTICS_ENABLED === true,
    plausibleDomain: env.PLAUSIBLE_DOMAIN,
    dataDomain: env.DATA_DOMAIN
  };
  return await handlePlausibleEvent(request, config);
};
const OPTIONS = async ({ request, locals }) => {
  const env = locals.runtime.env;
  const config = {
    analyticsEnabled: env.ANALYTICS_ENABLED === "true" || env.ANALYTICS_ENABLED === true,
    plausibleDomain: env.PLAUSIBLE_DOMAIN,
    dataDomain: env.DATA_DOMAIN
  };
  return await handlePlausibleEvent(request, config);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=event.astro.mjs.map
