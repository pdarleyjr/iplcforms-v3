/**
 * Plausible Analytics Script Proxy Route
 * Serves the Plausible analytics script through our domain
 */

import type { APIRoute } from 'astro';
import { handlePlausibleScript } from '../../../lib/analytics/plausible-proxy';

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  
  const config = {
    analyticsEnabled: env.ANALYTICS_ENABLED === 'true' || env.ANALYTICS_ENABLED === true,
    plausibleDomain: env.PLAUSIBLE_DOMAIN,
    dataDomain: env.DATA_DOMAIN,
  };
  
  return await handlePlausibleScript(request as any, config);
};