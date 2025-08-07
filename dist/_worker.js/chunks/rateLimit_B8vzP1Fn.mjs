globalThis.process ??= {}; globalThis.process.env ??= {};
const RATE_LIMIT_CONFIG = {
  tokensPerMinute: 60,
  burstSize: 10,
  refillRate: 1
  // 1 token per second
};
async function checkRateLimit(clientId, env) {
  const key = `ratelimit:${clientId}`;
  const now = Date.now();
  try {
    const bucketData = await env.CHAT_HISTORY.get(key, "json");
    let tokens = RATE_LIMIT_CONFIG.burstSize;
    let lastRefill = now;
    if (bucketData) {
      const timePassed = (now - bucketData.lastRefill) / 1e3;
      const tokensToAdd = Math.floor(timePassed * RATE_LIMIT_CONFIG.refillRate);
      tokens = Math.min(
        bucketData.tokens + tokensToAdd,
        RATE_LIMIT_CONFIG.burstSize
      );
      lastRefill = bucketData.lastRefill + tokensToAdd * 1e3;
    }
    if (tokens >= 1) {
      tokens -= 1;
      await env.CHAT_HISTORY.put(
        key,
        JSON.stringify({ tokens, lastRefill }),
        {
          expirationTtl: 300
          // 5 minutes TTL
        }
      );
      return {
        allowed: true,
        remaining: tokens,
        resetAt: lastRefill + (RATE_LIMIT_CONFIG.burstSize - tokens) * 1e3
      };
    } else {
      const resetAt = lastRefill + 1e3 / RATE_LIMIT_CONFIG.refillRate;
      return {
        allowed: false,
        remaining: 0,
        resetAt
      };
    }
  } catch (error) {
    console.error("Rate limit check error:", error);
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.burstSize - 1,
      resetAt: now + 6e4
    };
  }
}

export { checkRateLimit as c };
//# sourceMappingURL=rateLimit_B8vzP1Fn.mjs.map
