export const BASE_URL =
  (process.env.E2E_BASE_URL?.replace(/\/+$/, '') ?? 'http://127.0.0.1:8788');