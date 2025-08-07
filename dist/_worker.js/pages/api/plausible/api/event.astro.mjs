globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

async function POST(context) {
  const { request, locals } = context;
  const env = locals.runtime?.env;
  const plausibleDomain = env?.PLAUSIBLE_DOMAIN;
  if (!plausibleDomain) {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
  try {
    const body = await request.text();
    let eventData;
    try {
      eventData = JSON.parse(body);
      eventData.domain = plausibleDomain;
    } catch {
      eventData = body;
    }
    const plausibleResponse = await fetch("https://plausible.io/api/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("User-Agent") || "",
        "X-Forwarded-For": request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || ""
      },
      body: typeof eventData === "string" ? eventData : JSON.stringify(eventData)
    });
    return new Response(null, {
      status: plausibleResponse.ok ? 204 : 502,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.error("Error proxying Plausible event:", error);
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }
}
async function OPTIONS(context) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
      // 24 hours
    }
  });
}
const ALL = POST;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  OPTIONS,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=event.astro.mjs.map
