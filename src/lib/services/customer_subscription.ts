import type { D1Database } from '@cloudflare/workers-types';
import { getD1Manager, type D1ConnectionManager } from './d1-connection-manager';

export const CUSTOMER_SUBSCRIPTION_QUERIES = {
  BASE_SELECT: `
    SELECT 
      customer_subscriptions.*,
      customers.name as customer_name,
      customers.email as customer_email,
      subscriptions.name as subscription_name,
      subscriptions.description as subscription_description,
      subscriptions.price as subscription_price
    FROM customer_subscriptions
    LEFT JOIN customers 
      ON customer_subscriptions.customer_id = customers.id
    LEFT JOIN subscriptions 
      ON customer_subscriptions.subscription_id = subscriptions.id
  `,
  INSERT_CUSTOMER_SUBSCRIPTION: `
    INSERT INTO customer_subscriptions 
    (customer_id, subscription_id, status, subscription_ends_at) 
    VALUES (?, ?, ?, ?)
  `,
  UPDATE_STATUS: `
    UPDATE customer_subscriptions 
    SET status = ? 
    WHERE id = ?
  `,
  UPDATE_SUBSCRIPTION_ENDS_AT: `
    UPDATE customer_subscriptions 
    SET subscription_ends_at = ? 
    WHERE id = ?
  `,
  CHECK_EXISTING: `
    SELECT id, status 
    FROM customer_subscriptions 
    WHERE customer_id = ? AND subscription_id = ?
  `,
  EXPIRE_SUBSCRIPTIONS: `
    UPDATE customer_subscriptions 
    SET status = 'expired' 
    WHERE status = 'active' AND subscription_ends_at < ?
  `,
  GET_ACTIVE_COUNT_BY_SUBSCRIPTION: `
    SELECT subscription_id, COUNT(*) as active_count
    FROM customer_subscriptions
    WHERE status = 'active'
    GROUP BY subscription_id
  `,
  GET_CUSTOMER_SUBSCRIPTION_HISTORY: `
    SELECT 
      customer_subscriptions.*,
      subscriptions.name as subscription_name,
      subscriptions.price as subscription_price
    FROM customer_subscriptions
    LEFT JOIN subscriptions ON customer_subscriptions.subscription_id = subscriptions.id
    WHERE customer_id = ?
    ORDER BY customer_subscriptions.created_at DESC
  `
};

const processCustomerSubscriptionResults = (rows: any[]) => {
  const subscriptionsMap = new Map();

  rows.forEach((row) => {
    if (!subscriptionsMap.has(row.id)) {
      const customerSubscription = {
        id: row.id,
        status: row.status,
        subscription_ends_at: row.subscription_ends_at,
        created_at: row.created_at,
        updated_at: row.updated_at,
        customer: {
          id: row.customer_id,
          name: row.customer_name,
          email: row.customer_email,
        },
        subscription: {
          id: row.subscription_id,
          name: row.subscription_name,
          description: row.subscription_description,
          price: row.subscription_price,
        },
      };

      subscriptionsMap.set(row.id, customerSubscription);
    }
  });

  return Array.from(subscriptionsMap.values());
};

export class CustomerSubscriptionService {
  private d1Manager: D1ConnectionManager;

  constructor(DB: D1Database) {
    this.d1Manager = getD1Manager(DB);
  }

  async getById(id: string | number) {
    const cacheKey = `customer_subscription:${id}`;
    
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${CUSTOMER_SUBSCRIPTION_QUERIES.BASE_SELECT} WHERE customer_subscriptions.id = ?`;
        const stmt = this.d1Manager.prepare(query);
        const response = await stmt.bind(id).all();

        if (response.success && response.results.length > 0) {
          const [customerSubscription] = processCustomerSubscriptionResults(
            response.results,
          );
          return customerSubscription;
        }
        return null;
      },
      300 // 5-minute cache for individual subscriptions
    );
  }

  async getByCustomerId(customerId: string | number) {
    const cacheKey = `customer_subscriptions:customer:${customerId}`;
    
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${CUSTOMER_SUBSCRIPTION_QUERIES.BASE_SELECT} WHERE customer_subscriptions.customer_id = ?`;
        const stmt = this.d1Manager.prepare(query);
        const response = await stmt.bind(customerId).all();

        if (response.success) {
          return processCustomerSubscriptionResults(response.results);
        }
        return [];
      },
      120 // 2-minute cache for customer's subscriptions
    );
  }

  async getAll() {
    const cacheKey = 'customer_subscriptions:all';
    
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${CUSTOMER_SUBSCRIPTION_QUERIES.BASE_SELECT} ORDER BY customer_subscriptions.id ASC`;
        const stmt = this.d1Manager.prepare(query);
        const response = await stmt.all();

        if (response.success) {
          return processCustomerSubscriptionResults(response.results);
        }
        return [];
      },
      120 // 2-minute cache for all subscriptions list
    );
  }

  async create(customerSubscriptionData: {
    customer_id: number;
    subscription_id: number;
    status?: string;
    subscription_ends_at?: number;
  }) {
    const {
      customer_id,
      subscription_id,
      status = "active",
      subscription_ends_at = Date.now() + 60 * 60 * 24 * 30 * 1000, // 30 days from now by default (in milliseconds)
    } = customerSubscriptionData;

    // Check if subscription already exists
    const existingStmt = this.d1Manager.prepare(CUSTOMER_SUBSCRIPTION_QUERIES.CHECK_EXISTING);
    const existingResponse = await existingStmt.bind(customer_id, subscription_id).all();
    
    if (existingResponse.success && existingResponse.results.length > 0) {
      const existing = existingResponse.results[0] as any;
      throw new Error(`Customer already has this subscription (ID: ${existing.id}, Status: ${existing.status})`);
    }

    const stmt = this.d1Manager.prepare(
      CUSTOMER_SUBSCRIPTION_QUERIES.INSERT_CUSTOMER_SUBSCRIPTION,
    );
    const response = await stmt
      .bind(customer_id, subscription_id, status, subscription_ends_at)
      .run();

    if (!response.success) {
      throw new Error("Failed to create customer subscription");
    }

    // Clear relevant caches
    this.clearCustomerSubscriptionCaches(customer_id);

    return {
      success: true,
      customerSubscriptionId: response.meta.last_row_id,
    };
  }

  async updateStatus(id: string | number, status: string) {
    // Get the subscription to find customer_id for cache clearing
    const subscription = await this.getById(id);
    
    const stmt = this.d1Manager.prepare(
      CUSTOMER_SUBSCRIPTION_QUERIES.UPDATE_STATUS,
    );
    const response = await stmt
      .bind(status, id)
      .run();

    if (!response.success) {
      throw new Error("Failed to update customer subscription status");
    }

    // Clear relevant caches
    if (subscription) {
      this.clearCustomerSubscriptionCaches(subscription.customer.id, id);
    }

    return { success: true };
  }

  async updateSubscriptionEndsAt(id: string | number, subscriptionEndsAt: number) {
    // Get the subscription to find customer_id for cache clearing
    const subscription = await this.getById(id);
    
    const stmt = this.d1Manager.prepare(
      CUSTOMER_SUBSCRIPTION_QUERIES.UPDATE_SUBSCRIPTION_ENDS_AT,
    );
    const response = await stmt
      .bind(subscriptionEndsAt, id)
      .run();

    if (!response.success) {
      throw new Error("Failed to update subscription end date");
    }

    // Clear relevant caches
    if (subscription) {
      this.clearCustomerSubscriptionCaches(subscription.customer.id, id);
    }

    return { success: true };
  }

  // Additional helper methods

  async getActiveCountBySubscription() {
    const cacheKey = 'customer_subscriptions:active_counts';
    
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.d1Manager.prepare(CUSTOMER_SUBSCRIPTION_QUERIES.GET_ACTIVE_COUNT_BY_SUBSCRIPTION);
        const response = await stmt.all();

        if (response.success) {
          const countsMap = new Map<number, number>();
          response.results.forEach((row: any) => {
            countsMap.set(row.subscription_id, row.active_count);
          });
          return countsMap;
        }
        return new Map();
      },
      300 // 5-minute cache for analytics data
    );
  }

  async getCustomerSubscriptionHistory(customerId: string | number) {
    const cacheKey = `customer_subscription_history:${customerId}`;
    
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.d1Manager.prepare(CUSTOMER_SUBSCRIPTION_QUERIES.GET_CUSTOMER_SUBSCRIPTION_HISTORY);
        const response = await stmt.bind(customerId).all();

        if (response.success) {
          return response.results.map((row: any) => ({
            id: row.id,
            subscription_id: row.subscription_id,
            subscription_name: row.subscription_name,
            subscription_price: row.subscription_price,
            status: row.status,
            subscription_ends_at: row.subscription_ends_at,
            created_at: row.created_at,
            updated_at: row.updated_at,
          }));
        }
        return [];
      },
      120 // 2-minute cache for history data
    );
  }

  async expireOldSubscriptions() {
    const now = Date.now();
    const stmt = this.d1Manager.prepare(CUSTOMER_SUBSCRIPTION_QUERIES.EXPIRE_SUBSCRIPTIONS);
    const response = await stmt.bind(now).run();

    if (!response.success) {
      throw new Error("Failed to expire old subscriptions");
    }

    // Clear all caches since this affects multiple subscriptions
    this.d1Manager.clearSpecificCaches(['customer_subscription']);

    return {
      success: true,
      expiredCount: response.meta.changes || 0,
    };
  }

  // Cache invalidation helpers

  private clearCustomerSubscriptionCaches(customerId?: number, subscriptionId?: number | string) {
    const patterns = ['customer_subscriptions:all', 'customer_subscriptions:active_counts'];
    
    if (customerId) {
      patterns.push(`customer_subscriptions:customer:${customerId}`);
      patterns.push(`customer_subscription_history:${customerId}`);
    }
    
    if (subscriptionId) {
      patterns.push(`customer_subscription:${subscriptionId}`);
    }
    
    this.d1Manager.clearSpecificCaches(patterns);
  }

  // Bulk operations

  async bulkCreate(subscriptions: Array<{
    customer_id: number;
    subscription_id: number;
    status?: string;
    subscription_ends_at?: number;
  }>) {
    const results = await Promise.all(
      subscriptions.map(sub => this.create(sub).catch(err => ({ 
        success: false, 
        error: err.message,
        customer_id: sub.customer_id,
        subscription_id: sub.subscription_id 
      })))
    );

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    return {
      success: true,
      created: successful,
      failed: failed,
      total: subscriptions.length,
    };
  }

  async bulkUpdateStatus(updates: Array<{ id: number | string; status: string }>) {
    const results = await Promise.all(
      updates.map(update => this.updateStatus(update.id, update.status).catch(err => ({ 
        success: false, 
        error: err.message,
        id: update.id 
      })))
    );

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    return {
      success: true,
      updated: successful,
      failed: failed,
      total: updates.length,
    };
  }
}
