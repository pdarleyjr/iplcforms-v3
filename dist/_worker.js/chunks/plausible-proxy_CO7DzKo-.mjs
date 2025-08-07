globalThis.process ??= {}; globalThis.process.env ??= {};
async function handlePlausibleScript(request, config) {
  if (!config.analyticsEnabled) {
    return new Response("// Analytics disabled", {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=86400"
      }
    });
  }
  const plausibleDomain = config.plausibleDomain || "plausible.io";
  try {
    const scriptResponse = await fetch(`https://${plausibleDomain}/js/script.js`, {
      headers: {
        "User-Agent": request.headers.get("User-Agent") || ""
      }
    });
    if (!scriptResponse.ok) {
      throw new Error(`Failed to fetch Plausible script: ${scriptResponse.status}`);
    }
    const scriptContent = await scriptResponse.text();
    return new Response(scriptContent, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
        // Cache for 1 hour
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    console.error("Error proxying Plausible script:", error);
    return new Response("// Error loading analytics script", {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=300"
        // Cache error for 5 minutes
      }
    });
  }
}
async function handlePlausibleEvent(request, config) {
  if (!config.analyticsEnabled) {
    return new Response(JSON.stringify({ status: "disabled" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  const plausibleDomain = config.plausibleDomain || "plausible.io";
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Forwarded-For",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  try {
    const body = await request.text();
    const clientIP = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0] || "";
    const eventResponse = await fetch(`https://${plausibleDomain}/api/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": request.headers.get("User-Agent") || "",
        "X-Forwarded-For": clientIP,
        "Referer": request.headers.get("Referer") || ""
      },
      body
    });
    return new Response(await eventResponse.text(), {
      status: eventResponse.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (error) {
    console.error("Error proxying Plausible event:", error);
    return new Response(JSON.stringify({ error: "Failed to send event" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
async function handlePlausibleProxy(request, env) {
  const url = new URL(request.url);
  const config = {
    analyticsEnabled: env.ANALYTICS_ENABLED === "true" || env.ANALYTICS_ENABLED === true,
    plausibleDomain: env.PLAUSIBLE_DOMAIN,
    dataDomain: env.DATA_DOMAIN
  };
  if (url.pathname === "/a/js/plausible.js" || url.pathname === "/a/js/script.js") {
    return handlePlausibleScript(request, config);
  }
  if (url.pathname === "/a/api/event") {
    return handlePlausibleEvent(request, config);
  }
  return new Response("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain"
    }
  });
}

export { handlePlausibleScript as a, handlePlausibleProxy as b, handlePlausibleEvent as h };
//# sourceMappingURL=plausible-proxy_CO7DzKo-.mjs.map
