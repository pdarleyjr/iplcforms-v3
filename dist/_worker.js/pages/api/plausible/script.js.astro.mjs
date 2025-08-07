globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_DXs7ZzLR.mjs';

async function GET(context) {
  const { locals } = context;
  const env = locals.runtime?.env;
  const analyticsEnabled = env?.PLAUSIBLE_ENABLED === "true";
  if (!analyticsEnabled) {
    return new Response(
      "/* Plausible Analytics disabled */",
      {
        status: 200,
        headers: {
          "Content-Type": "application/javascript",
          "Cache-Control": "public, max-age=86400"
          // Cache for 1 day
        }
      }
    );
  }
  try {
    const plausibleResponse = await fetch("https://plausible.io/js/script.js", {
      headers: {
        "User-Agent": context.request.headers.get("User-Agent") || ""
      }
    });
    if (!plausibleResponse.ok) {
      throw new Error(`Failed to fetch Plausible script: ${plausibleResponse.status}`);
    }
    const scriptContent = await plausibleResponse.text();
    return new Response(scriptContent, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
        // Cache for 1 hour
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    console.error("Error proxying Plausible script:", error);
    return new Response(
      "/* Error loading Plausible Analytics */",
      {
        status: 200,
        headers: {
          "Content-Type": "application/javascript",
          "Cache-Control": "no-cache"
        }
      }
    );
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=script.js.astro.mjs.map
