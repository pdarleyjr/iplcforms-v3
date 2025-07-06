import type { D1Database } from '@cloudflare/workers-types';
import { D1ConnectionManager } from './d1-connection-manager';

export const SUBSCRIPTION_QUERIES = {
  BASE_SELECT: `
    SELECT 
      subscriptions.*,
      features.id as feature_id,
      features.name as feature_name,
      features.description as feature_description
    FROM subscriptions
    LEFT JOIN subscription_features 
      ON subscriptions.id = subscription_features.subscription_id
    LEFT JOIN features 
      ON subscription_features.feature_id = features.id
  `,
  INSERT_SUBSCRIPTION: `INSERT INTO subscriptions (name, description, price, billing_cycle, trial_days, max_forms, max_submissions) VALUES(?, ?, ?, ?, ?, ?, ?)`,
  UPDATE_SUBSCRIPTION: `UPDATE subscriptions SET name = ?, description = ?, price = ?, billing_cycle = ?, trial_days = ?, max_forms = ?, max_submissions = ? WHERE id = ?`,
  INSERT_FEATURE: `INSERT OR IGNORE INTO features(name, description) VALUES(?, ?)`,
  SELECT_FEATURE_ID: `SELECT id FROM features WHERE name = ?`,
  INSERT_SUBSCRIPTION_FEATURE: `INSERT INTO subscription_features(subscription_id, feature_id) VALUES(?, ?)`,
  DELETE_SUBSCRIPTION: `DELETE FROM subscriptions WHERE id = ?`,
  DELETE_SUBSCRIPTION_FEATURES: `DELETE FROM subscription_features WHERE subscription_id = ?`,
  
  // Analytics queries
  USAGE_STATS: `
    SELECT 
      s.id,
      s.name,
      COUNT(DISTINCT cs.customer_id) as active_customers,
      COUNT(DISTINCT ft.id) as forms_created,
      COUNT(DISTINCT fs.id) as submissions_count,
      AVG(fs.score) as avg_score
    FROM subscriptions s
    LEFT JOIN customer_subscriptions cs ON s.id = cs.subscription_id 
      AND cs.status = 'active'
    LEFT JOIN form_templates ft ON cs.customer_id = ft.customer_id
    LEFT JOIN form_submissions fs ON ft.id = fs.form_template_id
    WHERE s.id = ?
    GROUP BY s.id, s.name
  `,
  
  ANALYTICS_AGGREGATED: `
    SELECT 
      s.id,
      s.name,
      COUNT(DISTINCT cs.customer_id) as total_customers,
      COUNT(DISTINCT CASE WHEN cs.status = 'active' THEN cs.customer_id END) as active_customers,
      COUNT(DISTINCT CASE WHEN cs.status = 'trial' THEN cs.customer_id END) as trial_customers,
      SUM(s.price) as monthly_revenue,
      COUNT(DISTINCT ft.id) as total_forms,
      COUNT(DISTINCT fs.id) as total_submissions
    FROM subscriptions s
    LEFT JOIN customer_subscriptions cs ON s.id = cs.subscription_id
    LEFT JOIN form_templates ft ON cs.customer_id = ft.customer_id 
      AND ft.created_at >= date('now', '-30 days')
    LEFT JOIN form_submissions fs ON ft.id = fs.form_template_id
      AND fs.submitted_at >= date('now', '-30 days')
    GROUP BY s.id, s.name
    ORDER BY active_customers DESC
  `,
  
  POPULAR_FEATURES: `
    SELECT 
      f.name,
      f.description,
      COUNT(DISTINCT sf.subscription_id) as subscription_count,
      COUNT(DISTINCT cs.customer_id) as customer_count
    FROM features f
    JOIN subscription_features sf ON f.id = sf.feature_id
    JOIN customer_subscriptions cs ON sf.subscription_id = cs.subscription_id
    WHERE cs.status = 'active'
    GROUP BY f.id, f.name, f.description
    ORDER BY customer_count DESC
    LIMIT 10
  `,
  
  SUBSCRIPTION_LIMITS: `
    SELECT 
      s.*,
      COUNT(DISTINCT ft.id) as current_forms,
      COUNT(DISTINCT fs.id) as current_submissions
    FROM subscriptions s
    LEFT JOIN customer_subscriptions cs ON s.id = cs.subscription_id
    LEFT JOIN form_templates ft ON cs.customer_id = ft.customer_id
    LEFT JOIN form_submissions fs ON ft.id = fs.form_template_id
    WHERE s.id = ?
    GROUP BY s.id
  `
};

const processSubscriptionResults = (rows: any[]) => {
  const subscriptionsMap = new Map();

  rows.forEach((row) => {
    if (!subscriptionsMap.has(row.id)) {
      const subscription = { ...row, features: [] };
      subscriptionsMap.set(row.id, subscription);
    }

    if (row.feature_id) {
      const subscription = subscriptionsMap.get(row.id);
      subscription.features.push({
        id: row.feature_id,
        name: row.feature_name,
        description: row.feature_description,
      });
    }

    const subscription = subscriptionsMap.get(row.id);
    delete subscription.feature_id;
    delete subscription.feature_name;
    delete subscription.feature_description;
  });

  return Array.from(subscriptionsMap.values());
};

export class SubscriptionService {
  private DB: D1Database;
  private connectionManager: D1ConnectionManager;

  constructor(DB: D1Database) {
    this.DB = DB;
    this.connectionManager = new D1ConnectionManager(DB);
  }

  async getById(id: string | number) {
    const cacheKey = `subscription:${id}`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${SUBSCRIPTION_QUERIES.BASE_SELECT} WHERE subscriptions.id = ?`;
        const response = await this.connectionManager.prepare(query).bind(id).all();

        if (response.success && response.results?.length > 0) {
          const [subscription] = processSubscriptionResults(response.results);
          return subscription;
        }
        return null;
      },
      5 * 60 // 5 minutes cache
    );
  }

  async getAll() {
    const cacheKey = 'subscriptions:all';
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${SUBSCRIPTION_QUERIES.BASE_SELECT} ORDER BY subscriptions.id ASC`;
        const response = await this.connectionManager.prepare(query).all();

        if (response.success) {
          return processSubscriptionResults(response.results);
        }
        return [];
      },
      2 * 60 // 2 minutes cache for lists
    );
  }

  async getAllWithStats() {
    const cacheKey = 'subscriptions:with_stats';
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const subscriptions = await this.getAll();
        const analytics = await this.getAnalytics();
        
        return subscriptions.map(sub => {
          const stats = analytics.find(a => a.id === sub.id);
          return {
            ...sub,
            stats: stats || {
              total_customers: 0,
              active_customers: 0,
              trial_customers: 0,
              monthly_revenue: 0,
              total_forms: 0,
              total_submissions: 0
            }
          };
        });
      },
      5 * 60 // 5 minutes cache
    );
  }

  async getUsageStats(subscriptionId: string | number) {
    const cacheKey = `subscription:${subscriptionId}:usage`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const response = await this.connectionManager.prepare(SUBSCRIPTION_QUERIES.USAGE_STATS)
          .bind(subscriptionId)
          .first();

        return response || {
          id: subscriptionId,
          active_customers: 0,
          forms_created: 0,
          submissions_count: 0,
          avg_score: 0
        };
      },
      10 * 60 // 10 minutes cache for usage stats
    );
  }

  async getAnalytics() {
    const cacheKey = 'subscriptions:analytics';
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const response = await this.connectionManager.prepare(SUBSCRIPTION_QUERIES.ANALYTICS_AGGREGATED).all();
        return response.success ? response.results : [];
      },
      10 * 60 // 10 minutes cache for analytics
    );
  }

  async getPopularFeatures() {
    const cacheKey = 'features:popular';
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const response = await this.connectionManager.prepare(SUBSCRIPTION_QUERIES.POPULAR_FEATURES).all();
        return response.success ? response.results : [];
      },
      30 * 60 // 30 minutes cache for popular features
    );
  }

  async getSubscriptionLimits(subscriptionId: string | number) {
    const cacheKey = `subscription:${subscriptionId}:limits`;
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const response = await this.connectionManager.prepare(SUBSCRIPTION_QUERIES.SUBSCRIPTION_LIMITS)
          .bind(subscriptionId)
          .first();

        if (response) {
          const maxForms = Number(response.max_forms) || Infinity;
          const maxSubmissions = Number(response.max_submissions) || Infinity;
          const currentForms = Number(response.current_forms) || 0;
          const currentSubmissions = Number(response.current_submissions) || 0;
          
          return {
            ...response,
            forms_remaining: Math.max(0, maxForms - currentForms),
            submissions_remaining: Math.max(0, maxSubmissions - currentSubmissions),
            at_limit: {
              forms: maxForms !== Infinity && currentForms >= maxForms,
              submissions: maxSubmissions !== Infinity && currentSubmissions >= maxSubmissions
            }
          };
        }
        return null;
      },
      5 * 60 // 5 minutes cache
    );
  }

  async create(subscriptionData: {
    name: string;
    description?: string;
    price: number;
    billing_cycle?: string;
    trial_days?: number;
    max_forms?: number;
    max_submissions?: number;
    features?: Array<{
      name: string;
      description?: string;
    }>;
  }) {
    const { 
      name, 
      description, 
      price, 
      billing_cycle = 'monthly',
      trial_days = 0,
      max_forms = null,
      max_submissions = null,
      features 
    } = subscriptionData;

    const subscriptionResponse = await this.connectionManager.prepare(
      SUBSCRIPTION_QUERIES.INSERT_SUBSCRIPTION,
    )
      .bind(name, description, price, billing_cycle, trial_days, max_forms, max_submissions)
      .run();

    if (!subscriptionResponse.success) {
      throw new Error("Failed to create subscription");
    }

    const subscriptionId = subscriptionResponse.meta.last_row_id;

    if (features?.length) {
      await this.bulkCreateFeatures(subscriptionId, features);
    }

    // Clear related caches
    await this.clearSubscriptionCaches();

    return { success: true, subscriptionId };
  }

  async bulkCreateFeatures(subscriptionId: number, features: Array<{ name: string; description?: string }>) {
    if (!features.length) return;

    const operations = [];
    const featureIds = new Map();

    // Batch insert features
    for (const feature of features) {
      operations.push(
        this.connectionManager.prepare(SUBSCRIPTION_QUERIES.INSERT_FEATURE)
          .bind(feature.name, feature.description || null)
      );
    }

    await this.connectionManager.batch(operations);

    // Get feature IDs in batch
    const featureIdOperations = features.map(feature =>
      this.connectionManager.prepare(SUBSCRIPTION_QUERIES.SELECT_FEATURE_ID)
        .bind(feature.name)
    );

    const featureResults = await this.connectionManager.batch(featureIdOperations);
    
    // Map feature names to IDs
    features.forEach((feature, index) => {
      if (featureResults[index].success && featureResults[index].results?.length > 0) {
        featureIds.set(feature.name, featureResults[index].results[0].id);
      }
    });

    // Batch create subscription-feature relationships
    const relationshipOperations = [];
    for (const [featureName, featureId] of featureIds) {
      relationshipOperations.push(
        this.connectionManager.prepare(SUBSCRIPTION_QUERIES.INSERT_SUBSCRIPTION_FEATURE)
          .bind(subscriptionId, featureId)
      );
    }

    if (relationshipOperations.length > 0) {
      await this.connectionManager.batch(relationshipOperations);
    }
  }

  async update(id: string | number, subscriptionData: {
    name?: string;
    description?: string;
    price?: number;
    billing_cycle?: string;
    trial_days?: number;
    max_forms?: number;
    max_submissions?: number;
    features?: Array<{ name: string; description?: string }>;
  }) {
    const currentSubscription = await this.getById(id);
    if (!currentSubscription) {
      throw new Error("Subscription not found");
    }

    const {
      name = currentSubscription.name,
      description = currentSubscription.description,
      price = currentSubscription.price,
      billing_cycle = currentSubscription.billing_cycle,
      trial_days = currentSubscription.trial_days,
      max_forms = currentSubscription.max_forms,
      max_submissions = currentSubscription.max_submissions,
      features
    } = subscriptionData;

    const response = await this.connectionManager.prepare(SUBSCRIPTION_QUERIES.UPDATE_SUBSCRIPTION)
      .bind(name, description, price, billing_cycle, trial_days, max_forms, max_submissions, id)
      .run();

    if (!response.success) {
      throw new Error("Failed to update subscription");
    }

    // Update features if provided
    if (features) {
      await this.connectionManager.prepare(SUBSCRIPTION_QUERIES.DELETE_SUBSCRIPTION_FEATURES)
        .bind(id)
        .run();
      
      await this.bulkCreateFeatures(Number(id), features);
    }

    // Clear related caches
    await this.clearSubscriptionCaches(String(id));

    return { success: true };
  }

  async delete(id: string | number) {
    const operations = [
      this.connectionManager.prepare(SUBSCRIPTION_QUERIES.DELETE_SUBSCRIPTION_FEATURES).bind(id),
      this.connectionManager.prepare(SUBSCRIPTION_QUERIES.DELETE_SUBSCRIPTION).bind(id)
    ];

    const results = await this.connectionManager.batch(operations);
    
    if (!results.every(result => result.success)) {
      throw new Error("Failed to delete subscription");
    }

    // Clear related caches
    await this.clearSubscriptionCaches(String(id));

    return { success: true };
  }

  private async clearSubscriptionCaches(subscriptionId?: string) {
    const cacheKeys = [
      'subscriptions:all',
      'subscriptions:with_stats',
      'subscriptions:analytics',
      'features:popular'
    ];

    if (subscriptionId) {
      cacheKeys.push(
        `subscription:${subscriptionId}`,
        `subscription:${subscriptionId}:usage`,
        `subscription:${subscriptionId}:limits`
      );
    }

    for (const key of cacheKeys) {
      this.connectionManager.clearCaches();
    }
  }

  async getHealthMetrics() {
    const cacheKey = 'subscriptions:health';
    
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const [analytics, popularFeatures] = await Promise.all([
          this.getAnalytics(),
          this.getPopularFeatures()
        ]);

        const totalRevenue = analytics.reduce((sum, sub) => sum + (Number(sub.monthly_revenue) || 0), 0);
        const totalCustomers = analytics.reduce((sum, sub) => sum + (Number(sub.active_customers) || 0), 0);
        const avgRevenuePerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

        return {
          total_subscriptions: analytics.length,
          total_revenue: totalRevenue,
          total_customers: totalCustomers,
          avg_revenue_per_customer: avgRevenuePerCustomer,
          most_popular_features: popularFeatures.slice(0, 5),
          cache_stats: this.connectionManager.getCacheStats()
        };
      },
      15 * 60 // 15 minutes cache for health metrics
    );
  }
}
