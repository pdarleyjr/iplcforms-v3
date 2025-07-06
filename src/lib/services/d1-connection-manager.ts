import type { D1Database, D1DatabaseSession } from '@cloudflare/workers-types';

interface PreparedStatementCache {
  [key: string]: ReturnType<D1Database['prepare']>;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface JsonCacheEntry {
  parsed: any;
  timestamp: number;
}

/**
 * D1ConnectionManager - Optimized connection and caching layer for Cloudflare D1
 * Provides connection pooling, prepared statement caching, and edge caching
 */
export class D1ConnectionManager {
  private db: D1Database;
  private preparedStatements: PreparedStatementCache = {};
  private jsonCache: Map<string, JsonCacheEntry> = new Map();
  private dataCache: Map<string, CacheEntry<any>> = new Map();
  private session: D1DatabaseSession | null = null;
  private sessionTTL = 5 * 60 * 1000; // 5 minutes
  private sessionCreatedAt = 0;

  // Cache configuration
  private readonly JSON_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  private readonly DATA_CACHE_TTL = 2 * 60 * 1000; // 2 minutes
  private readonly MAX_CACHE_SIZE = 1000;

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * Get or create a prepared statement with caching
   */
  prepare(sql: string): ReturnType<D1Database['prepare']> {
    const cacheKey = this.generateSQLCacheKey(sql);
    
    if (!this.preparedStatements[cacheKey]) {
      this.preparedStatements[cacheKey] = this.db.prepare(sql);
    }
    
    return this.preparedStatements[cacheKey];
  }

  /**
   * Execute batch operations for related queries
   */
  async batch<T = unknown>(statements: ReturnType<D1Database['prepare']>[]): Promise<any[]> {
    try {
      const results = await this.db.batch(statements);
      return results;
    } catch (error) {
      console.error('D1 batch operation failed:', error);
      throw error;
    }
  }

  /**
   * Get session with automatic renewal
   */
  async getSession(): Promise<D1DatabaseSession> {
    const now = Date.now();
    
    if (!this.session || (now - this.sessionCreatedAt) > this.sessionTTL) {
      this.session = this.db.withSession();
      this.sessionCreatedAt = now;
    }
    
    return this.session;
  }

  /**
   * Parse JSON with caching to avoid repeated parsing
   */
  parseJSON(jsonString: string): any {
    if (!jsonString) return null;
    
    const cacheKey = this.generateJSONCacheKey(jsonString);
    const cached = this.jsonCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.JSON_CACHE_TTL) {
      return cached.parsed;
    }
    
    try {
      const parsed = JSON.parse(jsonString);
      this.jsonCache.set(cacheKey, {
        parsed,
        timestamp: Date.now()
      });
      
      // Cleanup cache if too large
      this.cleanupJSONCache();
      
      return parsed;
    } catch (error) {
      console.error('JSON parsing failed:', error);
      return null;
    }
  }

  /**
   * Cache frequently accessed data at edge
   */
  cacheData<T>(key: string, data: T, ttl: number = this.DATA_CACHE_TTL): void {
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
  getCachedData<T>(key: string): T | null {
    const entry = this.dataCache.get(key);
    
    if (!entry) return null;
    
    if ((Date.now() - entry.timestamp) > entry.ttl) {
      this.dataCache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  /**
   * Execute optimized query with caching
   */
  async executeWithCache<T>(
    cacheKey: string,
    queryFn: () => Promise<T>,
    ttl: number = this.DATA_CACHE_TTL
  ): Promise<T> {
    // Check cache first
    const cached = this.getCachedData<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }
    
    // Execute query
    const result = await queryFn();
    
    // Cache result
    this.cacheData(cacheKey, result, ttl);
    
    return result;
  }

  /**
   * Bulk insert optimization using batch operations
   */
  async bulkInsert(
    tableName: string,
    records: any[],
    columns: string[]
  ): Promise<any[]> {
    if (records.length === 0) return [];
    
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    const statements = records.map(record => {
      const values = columns.map(col => record[col]);
      return this.prepare(sql).bind(...values);
    });
    
    return this.batch(statements);
  }

  /**
   * Optimized analytics aggregation
   */
  async getAggregatedStats(
    tableName: string,
    groupBy: string[],
    aggregations: string[],
    filters: Record<string, any> = {}
  ): Promise<any[]> {
    const whereClause = Object.keys(filters).length > 0
      ? `WHERE ${Object.keys(filters).map(key => `${key} = ?`).join(' AND ')}`
      : '';
    
    const groupByClause = groupBy.length > 0 ? `GROUP BY ${groupBy.join(', ')}` : '';
    
    const sql = `
      SELECT 
        ${groupBy.join(', ')},
        ${aggregations.join(', ')}
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
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.db.prepare('SELECT 1 as health').first();
      return result?.health === 1;
    } catch {
      return false;
    }
  }

  /**
   * Cleanup methods
   */
  private cleanupJSONCache(): void {
    if (this.jsonCache.size > this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.jsonCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest 20% of entries
      const removeCount = Math.floor(this.MAX_CACHE_SIZE * 0.2);
      for (let i = 0; i < removeCount; i++) {
        this.jsonCache.delete(entries[i][0]);
      }
    }
  }

  private cleanupDataCache(): void {
    if (this.dataCache.size > this.MAX_CACHE_SIZE) {
      const now = Date.now();
      
      // Remove expired entries first
      for (const [key, entry] of this.dataCache.entries()) {
        if ((now - entry.timestamp) > entry.ttl) {
          this.dataCache.delete(key);
        }
      }
      
      // If still too large, remove oldest entries
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

  private generateSQLCacheKey(sql: string): string {
    return `sql_${this.hashString(sql)}`;
  }

  private generateJSONCacheKey(jsonString: string): string {
    return `json_${this.hashString(jsonString)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Reset caches - useful for testing
   */
  clearCaches(): void {
    this.preparedStatements = {};
    this.jsonCache.clear();
    this.dataCache.clear();
    this.session = null;
  }

  /**
   * Clear specific cache keys
   */
  clearSpecificCaches(patterns: string[]): void {
    for (const pattern of patterns) {
      // Clear data cache entries matching pattern
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
  getCacheStats(): {
    preparedStatements: number;
    jsonCache: number;
    dataCache: number;
    hasActiveSession: boolean;
  } {
    return {
      preparedStatements: Object.keys(this.preparedStatements).length,
      jsonCache: this.jsonCache.size,
      dataCache: this.dataCache.size,
      hasActiveSession: this.session !== null
    };
  }
}

/**
 * Global D1 connection manager singleton
 */
let globalD1Manager: D1ConnectionManager | null = null;

export function getD1Manager(db: D1Database): D1ConnectionManager {
  if (!globalD1Manager) {
    globalD1Manager = new D1ConnectionManager(db);
  }
  return globalD1Manager;
}

export function resetD1Manager(): void {
  globalD1Manager = null;
}