/**
 * Plausible Analytics Event Proxy Route
 * Handles analytics event tracking through our domain
 */

import type { APIRoute } from 'astro';
import { handlePlausibleEvent } from '../../../lib/analytics/plausible-proxy';

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  
  const config = {
    analyticsEnabled: env.ANALYTICS_ENABLED === 'true' || env.ANALYTICS_ENABLED === true,
    plausibleDomain: env.PLAUSIBLE_DOMAIN,
    dataDomain: env.DATA_DOMAIN,
  };
  
  return await handlePlausibleEvent(request as any, config);
};

export const OPTIONS: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime.env;
  
  const config = {
    analyticsEnabled: env.ANALYTICS_ENABLED === 'true' || env.ANALYTICS_ENABLED === true,
    plausibleDomain: env.PLAUSIBLE_DOMAIN,
    dataDomain: env.DATA_DOMAIN,
  };
  
  return await handlePlausibleEvent(request as any, config);
};