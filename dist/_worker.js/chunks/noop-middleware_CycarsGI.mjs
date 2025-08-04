globalThis.process ??= {}; globalThis.process.env ??= {};
import { a1 as NOOP_MIDDLEWARE_HEADER } from './astro/server_Cd9lk-7F.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

export { NOOP_MIDDLEWARE_FN as N };
//# sourceMappingURL=noop-middleware_CycarsGI.mjs.map
