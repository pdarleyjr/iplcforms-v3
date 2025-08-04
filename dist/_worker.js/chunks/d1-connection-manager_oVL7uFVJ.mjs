globalThis.process ??= {}; globalThis.process.env ??= {};
class D1ConnectionManager {
  db;
  preparedStatements = {};
  jsonCache = /* @__PURE__ */ new Map();
  dataCache = /* @__PURE__ */ new Map();
  session = null;
  sessionTTL = 5 * 60 * 1e3;
  // 5 minutes
  sessionCreatedAt = 0;
  // Cache configuration
  JSON_CACHE_TTL = 10 * 60 * 1e3;
  // 10 minutes
  DATA_CACHE_TTL = 2 * 60 * 1e3;
  // 2 minutes
  MAX_CACHE_SIZE = 1e3;
  constructor(db) {
    this.db = db;
  }
  /**
   * Get or create a prepared statement with caching
   */
  prepare(sql) {
    const cacheKey = this.generateSQLCacheKey(sql);
    if (!this.preparedStatements[cacheKey]) {
      this.preparedStatements[cacheKey] = this.db.prepare(sql);
    }
    return this.preparedStatements[cacheKey];
  }
  /**
   * Execute batch operations for related queries
   */
  async batch(statements) {
    try {
      const results = await this.db.batch(statements);
      return results;
    } catch (error) {
      console.error("D1 batch operation failed:", error);
      throw error;
    }
  }
  /**
   * Get session with automatic renewal
   */
  async getSession() {
    const now = Date.now();
    if (!this.session || now - this.sessionCreatedAt > this.sessionTTL) {
      this.session = this.db.withSession();
      this.sessionCreatedAt = now;
    }
    return this.session;
  }
  /**
   * Parse JSON with caching to avoid repeated parsing
   */
  parseJSON(jsonString) {
    if (!jsonString) return null;
    const cacheKey = this.generateJSONCacheKey(jsonString);
    const cached = this.jsonCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.JSON_CACHE_TTL) {
      return cached.parsed;
    }
    try {
      const parsed = JSON.parse(jsonString);
      this.jsonCache.set(cacheKey, {
        parsed,
        timestamp: Date.now()
      });
      this.cleanupJSONCache();
      return parsed;
    } catch (error) {
      console.error("JSON parsing failed:", error);
      return null;
    }
  }
  /**
   * Cache frequently accessed data at edge
   */
  cacheData(key, data, ttl = this.DATA_CACHE_TTL) {
    this.dataCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    this.cleanupDataCache();
  }
  /**
   * Get cached data if available and not expired
   */
  getCachedData(key) {
    const entry = this.dataCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.dataCache.delete(key);
      return null;
    }
    return entry.data;
  }
  /**
   * Execute optimized query with caching
   */
  async executeWithCache(cacheKey, queryFn, ttl = this.DATA_CACHE_TTL) {
    const cached = this.getCachedData(cacheKey);
    if (cached !== null) {
      return cached;
    }
    const result = await queryFn();
    this.cacheData(cacheKey, result, ttl);
    return result;
  }
  /**
   * Bulk insert optimization using batch operations
   */
  async bulkInsert(tableName, records, columns) {
    if (records.length === 0) return [];
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;
    const statements = records.map((record) => {
      const values = columns.map((col) => record[col]);
      return this.prepare(sql).bind(...values);
    });
    return this.batch(statements);
  }
  /**
   * Optimized analytics aggregation
   */
  async getAggregatedStats(tableName, groupBy, aggregations, filters = {}) {
    const whereClause = Object.keys(filters).length > 0 ? `WHERE ${Object.keys(filters).map((key) => `${key} = ?`).join(" AND ")}` : "";
    const groupByClause = groupBy.length > 0 ? `GROUP BY ${groupBy.join(", ")}` : "";
    const sql = `
      SELECT 
        ${groupBy.join(", ")},
        ${aggregations.join(", ")}
      FROM ${tableName}
      ${whereClause}
      ${groupByClause}
    `;
    const stmt = this.prepare(sql);
    const bindValues = Object.values(filters);
    const response = await stmt.bind(...bindValues).all();
    return response.success ? response.results : [];
  }
  /**
   * Connection health check
   */
  async healthCheck() {
    try {
      const result = await this.db.prepare("SELECT 1 as health").first();
      return result?.health === 1;
    } catch {
      return false;
    }
  }
  /**
   * Cleanup methods
   */
  cleanupJSONCache() {
    if (this.jsonCache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.jsonCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const removeCount = Math.floor(this.MAX_CACHE_SIZE * 0.2);
      for (let i = 0; i < removeCount; i++) {
        this.jsonCache.delete(entries[i][0]);
      }
    }
  }
  cleanupDataCache() {
    if (this.dataCache.size > this.MAX_CACHE_SIZE) {
      const now = Date.now();
      for (const [key, entry] of this.dataCache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.dataCache.delete(key);
        }
      }
      if (this.dataCache.size > this.MAX_CACHE_SIZE) {
        const entries = Array.from(this.dataCache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        const removeCount = Math.floor(this.MAX_CACHE_SIZE * 0.2);
        for (let i = 0; i < removeCount; i++) {
          this.dataCache.delete(entries[i][0]);
        }
      }
    }
  }
  generateSQLCacheKey(sql) {
    return `sql_${this.hashString(sql)}`;
  }
  generateJSONCacheKey(jsonString) {
    return `json_${this.hashString(jsonString)}`;
  }
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
  /**
   * Reset caches - useful for testing
   */
  clearCaches() {
    this.preparedStatements = {};
    this.jsonCache.clear();
    this.dataCache.clear();
    this.session = null;
  }
  /**
   * Clear specific cache keys
   */
  clearSpecificCaches(patterns) {
    for (const pattern of patterns) {
      for (const key of this.dataCache.keys()) {
        if (key.includes(pattern)) {
          this.dataCache.delete(key);
        }
      }
    }
  }
  /**
   * Get cache statistics for monitoring
   */
  getCacheStats() {
    return {
      preparedStatements: Object.keys(this.preparedStatements).length,
      jsonCache: this.jsonCache.size,
      dataCache: this.dataCache.size,
      hasActiveSession: this.session !== null
    };
  }
}
let globalD1Manager = null;
function getD1Manager(db) {
  if (!globalD1Manager) {
    globalD1Manager = new D1ConnectionManager(db);
  }
  return globalD1Manager;
}

export { D1ConnectionManager as D, getD1Manager as g };
//# sourceMappingURL=d1-connection-manager_oVL7uFVJ.mjs.map
