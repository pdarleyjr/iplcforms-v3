globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getD1Manager } from './d1-connection-manager_oVL7uFVJ.mjs';

const CUSTOMER_QUERIES = {
  // Optimized: Reduced JOIN complexity, added indexes hint
  BASE_SELECT: `
    SELECT
      customers.*,
      customer_subscriptions.id as subscription_id,
      customer_subscriptions.status as subscription_status,
      subscriptions.name as subscription_name,
      subscriptions.description as subscription_description,
      subscriptions.price as subscription_price
    FROM customers
    LEFT JOIN customer_subscriptions
      ON customers.id = customer_subscriptions.customer_id
    LEFT JOIN subscriptions
      ON customer_subscriptions.subscription_id = subscriptions.id
  `,
  INSERT_CUSTOMER: `INSERT INTO customers (name, email, notes) VALUES (?, ?, ?)`,
  INSERT_CUSTOMER_SUBSCRIPTION: `
    INSERT INTO customer_subscriptions (customer_id, subscription_id, status)
    VALUES (?, ?, ?)
  `,
  GET_BY_ID: `WHERE customers.id = ?`,
  GET_BY_EMAIL: `WHERE customers.email = ?`,
  // Optimized: Analytics query combining multiple metrics
  CUSTOMER_ANALYTICS: `
    SELECT
      COUNT(*) as total_customers,
      COUNT(CASE WHEN customer_subscriptions.status = 'active' THEN 1 END) as active_customers,
      COUNT(CASE WHEN customers.created_at >= date('now', '-30 days') THEN 1 END) as new_customers_30d,
      AVG(subscriptions.price) as avg_subscription_price
    FROM customers
    LEFT JOIN customer_subscriptions ON customers.id = customer_subscriptions.customer_id
    LEFT JOIN subscriptions ON customer_subscriptions.subscription_id = subscriptions.id
  `,
  // Optimized: Batch customer data with subscription info
  GET_CUSTOMERS_WITH_STATS: `
    SELECT
      customers.*,
      customer_subscriptions.status as subscription_status,
      subscriptions.name as subscription_name,
      subscriptions.price as subscription_price,
      COUNT(form_submissions.id) as total_submissions
    FROM customers
    LEFT JOIN customer_subscriptions ON customers.id = customer_subscriptions.customer_id
    LEFT JOIN subscriptions ON customer_subscriptions.subscription_id = subscriptions.id
    LEFT JOIN form_submissions ON customers.id = form_submissions.submitted_by
    GROUP BY customers.id
  `
};
const processCustomerResults = (rows) => {
  const customersMap = /* @__PURE__ */ new Map();
  rows.forEach((row) => {
    if (!customersMap.has(row.id)) {
      const customer = { ...row };
      if (row.subscription_id) {
        customer.subscription = {
          id: row.subscription_id,
          status: row.subscription_status,
          name: row.subscription_name,
          description: row.subscription_description,
          price: row.subscription_price
        };
      }
      delete customer.subscription_id;
      delete customer.subscription_status;
      delete customer.subscription_name;
      delete customer.subscription_description;
      delete customer.subscription_price;
      customersMap.set(row.id, customer);
    }
  });
  return Array.from(customersMap.values());
};
class CustomerService {
  connectionManager;
  constructor(DB) {
    this.connectionManager = getD1Manager(DB);
  }
  async getById(id) {
    const cacheKey = `customer_${id}`;
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${CUSTOMER_QUERIES.BASE_SELECT} ${CUSTOMER_QUERIES.GET_BY_ID}`;
        const stmt = this.connectionManager.prepare(query);
        const response = await stmt.bind(id).all();
        if (response.success) {
          const [customer] = processCustomerResults(response.results);
          return customer;
        }
        return null;
      },
      5 * 60 * 1e3
      // 5 minute cache
    );
  }
  async getByEmail(email) {
    const cacheKey = `customer_email_${email}`;
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${CUSTOMER_QUERIES.BASE_SELECT} ${CUSTOMER_QUERIES.GET_BY_EMAIL}`;
        const stmt = this.connectionManager.prepare(query);
        const response = await stmt.bind(email).all();
        if (response.success) {
          const [customer] = processCustomerResults(response.results);
          return customer;
        }
        return null;
      },
      5 * 60 * 1e3
      // 5 minute cache
    );
  }
  async getAll() {
    const cacheKey = "customers_all";
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${CUSTOMER_QUERIES.BASE_SELECT} ORDER BY customers.id ASC`;
        const stmt = this.connectionManager.prepare(query);
        const response = await stmt.all();
        if (response.success) {
          return processCustomerResults(response.results);
        }
        return [];
      },
      2 * 60 * 1e3
      // 2 minute cache for list
    );
  }
  async getAllWithStats() {
    const cacheKey = "customers_with_stats";
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.connectionManager.prepare(CUSTOMER_QUERIES.GET_CUSTOMERS_WITH_STATS);
        const response = await stmt.all();
        if (response.success) {
          return response.results.map((row) => ({
            ...row,
            total_submissions: row.total_submissions || 0
          }));
        }
        return [];
      },
      2 * 60 * 1e3
      // 2 minute cache
    );
  }
  async getAnalytics() {
    const cacheKey = "customer_analytics";
    return this.connectionManager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.connectionManager.prepare(CUSTOMER_QUERIES.CUSTOMER_ANALYTICS);
        const response = await stmt.first();
        return response || {};
      },
      5 * 60 * 1e3
      // 5 minute cache for analytics
    );
  }
  async create(customerData) {
    const { name, email, notes, subscription } = customerData;
    if (subscription) {
      const customerStmt = this.connectionManager.prepare(CUSTOMER_QUERIES.INSERT_CUSTOMER).bind(name, email, notes || null);
      const response = await customerStmt.run();
      if (!response.success) {
        throw new Error("Failed to create customer");
      }
      const customerId = response.meta.last_row_id;
      const subscriptionStmt = this.connectionManager.prepare(CUSTOMER_QUERIES.INSERT_CUSTOMER_SUBSCRIPTION).bind(customerId, subscription.id, subscription.status);
      const subscriptionResponse = await subscriptionStmt.run();
      if (!subscriptionResponse.success) {
        throw new Error("Failed to create customer subscription relationship");
      }
      this.clearCustomerCaches();
      return { success: true, customerId };
    } else {
      const stmt = this.connectionManager.prepare(CUSTOMER_QUERIES.INSERT_CUSTOMER);
      const response = await stmt.bind(name, email, notes || null).run();
      if (!response.success) {
        throw new Error("Failed to create customer");
      }
      const customerId = response.meta.last_row_id;
      this.clearCustomerCaches();
      return { success: true, customerId };
    }
  }
  async bulkCreate(customers) {
    if (customers.length === 0) return { success: true, customerIds: [] };
    const results = await this.connectionManager.bulkInsert(
      "customers",
      customers,
      ["name", "email", "notes"]
    );
    const customerIds = results.filter((r) => r.success).map((r) => r.meta.last_row_id);
    this.clearCustomerCaches();
    return { success: true, customerIds };
  }
  async updateSubscriptionStatus(customerId, status) {
    const stmt = this.connectionManager.prepare(`
      UPDATE customer_subscriptions
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE customer_id = ?
    `);
    const response = await stmt.bind(status, customerId).run();
    if (!response.success) {
      throw new Error("Failed to update subscription status");
    }
    this.connectionManager.cacheData(`customer_${customerId}`, null, 0);
    this.clearCustomerCaches();
    return { success: true };
  }
  clearCustomerCaches() {
    this.connectionManager.cacheData("customers_all", null, 0);
    this.connectionManager.cacheData("customers_with_stats", null, 0);
    this.connectionManager.cacheData("customer_analytics", null, 0);
  }
  async healthCheck() {
    return this.connectionManager.healthCheck();
  }
  getCacheStats() {
    return this.connectionManager.getCacheStats();
  }
}

export { CustomerService as C };
//# sourceMappingURL=customer_CfmmZeU3.mjs.map
