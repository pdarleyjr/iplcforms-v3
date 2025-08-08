globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const GET = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({
      success: true,
      data: {
        sessionId: "test-session",
        components: [],
        metadata: {}
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    return new Response(JSON.stringify({
      success: false,
      error: "sessionId is required"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const id = env.FORM_SESSION.idFromName(sessionId);
    const stub = env.FORM_SESSION.get(id);
    const doUrl = new URL(request.url);
    doUrl.searchParams.set("sessionId", sessionId);
    const response = await stub.fetch(doUrl.toString(), {
      method: "GET"
    });
    return response;
  } catch (error) {
    console.error("Error fetching session:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to fetch session"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request, locals }) => {
  try {
    const env = locals.runtime?.env;
    const requestClone = request.clone();
    const body = await requestClone.json();
    if (!env || !env.FORM_SESSION) {
      return new Response(JSON.stringify({
        success: true,
        message: "Test environment - session saved",
        session: {
          sessionId: body.sessionId,
          formData: body.formData || {},
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { sessionId } = body;
    if (!sessionId) {
      return new Response(JSON.stringify({
        success: false,
        error: "sessionId is required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const id = env.FORM_SESSION.idFromName(sessionId);
    const stub = env.FORM_SESSION.get(id);
    const doUrl = new URL(request.url);
    doUrl.searchParams.set("sessionId", sessionId);
    const response = await stub.fetch(doUrl.toString(), {
      method: "POST",
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    return response;
  } catch (error) {
    console.error("Error saving session:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to save session",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ request, locals }) => {
  const env = locals.runtime?.env;
  if (!env) {
    return new Response(JSON.stringify({
      success: true,
      message: "Test environment - session deleted"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    return new Response(JSON.stringify({
      success: false,
      error: "sessionId is required"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const id = env.FORM_SESSION.idFromName(sessionId);
    const stub = env.FORM_SESSION.get(id);
    const doUrl = new URL(request.url);
    doUrl.searchParams.set("sessionId", sessionId);
    const response = await stub.fetch(doUrl.toString(), {
      method: "DELETE"
    });
    return response;
  } catch (error) {
    console.error("Error deleting session:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Failed to delete session"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=form-sessions.astro.mjs.map
