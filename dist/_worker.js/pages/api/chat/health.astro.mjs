globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_BIJ3dQRj.mjs';

const GET = async () => {
  return new Response(JSON.stringify({ status: "ok", env: "iplcforms-v3" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async () => {
  return new Response(JSON.stringify({ status: "ok", env: "iplcforms-v3" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=health.astro.mjs.map
