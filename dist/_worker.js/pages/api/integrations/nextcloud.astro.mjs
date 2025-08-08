globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals }) => {
  try {
    const runtime = locals.runtime;
    const env = runtime.env;
    const data = await request.json();
    if (!data || typeof data !== "object") {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { nextcloudUrl, nextcloudUsername, nextcloudPassword, nextcloudPath } = data;
    if (!nextcloudUrl || !nextcloudUsername || !nextcloudPassword || !nextcloudPath) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    try {
      new URL(nextcloudUrl);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid Nextcloud URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const config = {
      url: nextcloudUrl.replace(/\/$/, ""),
      // Remove trailing slash
      username: nextcloudUsername,
      path: nextcloudPath.startsWith("/") ? nextcloudPath : `/${nextcloudPath}`,
      configured: true,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.CACHE_KV.put("integration:nextcloud:config", JSON.stringify(config), {
      expirationTtl: 365 * 24 * 60 * 60
      // 1 year
    });
    await env.CACHE_KV.put("integration:nextcloud:password", nextcloudPassword, {
      expirationTtl: 365 * 24 * 60 * 60
      // 1 year
    });
    try {
      const testUrl = `${config.url}/remote.php/dav/files/${config.username}/`;
      const testResponse = await fetch(testUrl, {
        method: "PROPFIND",
        headers: {
          "Authorization": `Basic ${btoa(`${config.username}:${nextcloudPassword}`)}`,
          "Depth": "0"
        }
      });
      if (!testResponse.ok && testResponse.status !== 207) {
        throw new Error(`Connection test failed: ${testResponse.status}`);
      }
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Failed to connect to Nextcloud. Please check your credentials and URL."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      message: "Nextcloud configuration saved and verified successfully!"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error saving Nextcloud configuration:", error);
    return new Response(JSON.stringify({
      error: "Failed to save configuration"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async ({ locals }) => {
  try {
    const runtime = locals.runtime;
    const env = runtime.env;
    const config = await env.CACHE_KV.get("integration:nextcloud:config");
    if (!config) {
      return new Response(JSON.stringify({ configured: false }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const parsedConfig = JSON.parse(config);
    delete parsedConfig.password;
    return new Response(JSON.stringify(parsedConfig), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching Nextcloud configuration:", error);
    return new Response(JSON.stringify({ configured: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=nextcloud.astro.mjs.map
