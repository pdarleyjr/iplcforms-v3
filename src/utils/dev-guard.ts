export function isDev(): boolean { return import.meta.env.DEV === true; }
export function assertDev(): void { if (!isDev()) { throw new Error('Not available in production'); } }