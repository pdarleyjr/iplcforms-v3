globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getD1Manager } from '../../chunks/d1-connection-manager_oVL7uFVJ.mjs';
import { a as authenticate, b as authorize } from '../../chunks/rbac-middleware_C5PL4AHx.mjs';
import { P as PERMISSIONS } from '../../chunks/rbac_vK5lyOl9.mjs';
import { v as validateQueryParams, P as PaginationSchema, a as validateRequest, C as CreateCustomerSubscriptionRequest } from '../../chunks/api-validation_EhNMe3Jy.mjs';
import { w as withPerformanceMonitoring } from '../../chunks/performance-wrapper_COlTcJLx.mjs';
export { renderers } from '../../renderers.mjs';

const CUSTOMER_SUBSCRIPTION_QUERIES = {
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
const processCustomerSubscriptionResults = (rows) => {
  const subscriptionsMap = /* @__PURE__ */ new Map();
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
          email: row.customer_email
        },
        subscription: {
          id: row.subscription_id,
          name: row.subscription_name,
          description: row.subscription_description,
          price: row.subscription_price
        }
      };
      subscriptionsMap.set(row.id, customerSubscription);
    }
  });
  return Array.from(subscriptionsMap.values());
};
class CustomerSubscriptionService {
  d1Manager;
  constructor(DB) {
    this.d1Manager = getD1Manager(DB);
  }
  async getById(id) {
    const cacheKey = `customer_subscription:${id}`;
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const query = `${CUSTOMER_SUBSCRIPTION_QUERIES.BASE_SELECT} WHERE customer_subscriptions.id = ?`;
        const stmt = this.d1Manager.prepare(query);
        const response = await stmt.bind(id).all();
        if (response.success && response.results.length > 0) {
          const [customerSubscription] = processCustomerSubscriptionResults(
            response.results
          );
          return customerSubscription;
        }
        return null;
      },
      300
      // 5-minute cache for individual subscriptions
    );
  }
  async getByCustomerId(customerId) {
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
      120
      // 2-minute cache for customer's subscriptions
    );
  }
  async getAll() {
    const cacheKey = "customer_subscriptions:all";
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
      120
      // 2-minute cache for all subscriptions list
    );
  }
  async create(customerSubscriptionData) {
    const {
      customer_id,
      subscription_id,
      status = "active",
      subscription_ends_at = Date.now() + 60 * 60 * 24 * 30 * 1e3
      // 30 days from now by default (in milliseconds)
    } = customerSubscriptionData;
    const existingStmt = this.d1Manager.prepare(CUSTOMER_SUBSCRIPTION_QUERIES.CHECK_EXISTING);
    const existingResponse = await existingStmt.bind(customer_id, subscription_id).all();
    if (existingResponse.success && existingResponse.results.length > 0) {
      const existing = existingResponse.results[0];
      throw new Error(`Customer already has this subscription (ID: ${existing.id}, Status: ${existing.status})`);
    }
    const stmt = this.d1Manager.prepare(
      CUSTOMER_SUBSCRIPTION_QUERIES.INSERT_CUSTOMER_SUBSCRIPTION
    );
    const response = await stmt.bind(customer_id, subscription_id, status, subscription_ends_at).run();
    if (!response.success) {
      throw new Error("Failed to create customer subscription");
    }
    this.clearCustomerSubscriptionCaches(customer_id);
    return {
      success: true,
      customerSubscriptionId: response.meta.last_row_id
    };
  }
  async updateStatus(id, status) {
    const subscription = await this.getById(id);
    const stmt = this.d1Manager.prepare(
      CUSTOMER_SUBSCRIPTION_QUERIES.UPDATE_STATUS
    );
    const response = await stmt.bind(status, id).run();
    if (!response.success) {
      throw new Error("Failed to update customer subscription status");
    }
    if (subscription) {
      this.clearCustomerSubscriptionCaches(subscription.customer.id, id);
    }
    return { success: true };
  }
  async updateSubscriptionEndsAt(id, subscriptionEndsAt) {
    const subscription = await this.getById(id);
    const stmt = this.d1Manager.prepare(
      CUSTOMER_SUBSCRIPTION_QUERIES.UPDATE_SUBSCRIPTION_ENDS_AT
    );
    const response = await stmt.bind(subscriptionEndsAt, id).run();
    if (!response.success) {
      throw new Error("Failed to update subscription end date");
    }
    if (subscription) {
      this.clearCustomerSubscriptionCaches(subscription.customer.id, id);
    }
    return { success: true };
  }
  // Additional helper methods
  async getActiveCountBySubscription() {
    const cacheKey = "customer_subscriptions:active_counts";
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.d1Manager.prepare(CUSTOMER_SUBSCRIPTION_QUERIES.GET_ACTIVE_COUNT_BY_SUBSCRIPTION);
        const response = await stmt.all();
        if (response.success) {
          const countsMap = /* @__PURE__ */ new Map();
          response.results.forEach((row) => {
            countsMap.set(row.subscription_id, row.active_count);
          });
          return countsMap;
        }
        return /* @__PURE__ */ new Map();
      },
      300
      // 5-minute cache for analytics data
    );
  }
  async getCustomerSubscriptionHistory(customerId) {
    const cacheKey = `customer_subscription_history:${customerId}`;
    return this.d1Manager.executeWithCache(
      cacheKey,
      async () => {
        const stmt = this.d1Manager.prepare(CUSTOMER_SUBSCRIPTION_QUERIES.GET_CUSTOMER_SUBSCRIPTION_HISTORY);
        const response = await stmt.bind(customerId).all();
        if (response.success) {
          return response.results.map((row) => ({
            id: row.id,
            subscription_id: row.subscription_id,
            subscription_name: row.subscription_name,
            subscription_price: row.subscription_price,
            status: row.status,
            subscription_ends_at: row.subscription_ends_at,
            created_at: row.created_at,
            updated_at: row.updated_at
          }));
        }
        return [];
      },
      120
      // 2-minute cache for history data
    );
  }
  async expireOldSubscriptions() {
    const now = Date.now();
    const stmt = this.d1Manager.prepare(CUSTOMER_SUBSCRIPTION_QUERIES.EXPIRE_SUBSCRIPTIONS);
    const response = await stmt.bind(now).run();
    if (!response.success) {
      throw new Error("Failed to expire old subscriptions");
    }
    this.d1Manager.clearSpecificCaches(["customer_subscription"]);
    return {
      success: true,
      expiredCount: response.meta.changes || 0
    };
  }
  // Cache invalidation helpers
  clearCustomerSubscriptionCaches(customerId, subscriptionId) {
    const patterns = ["customer_subscriptions:all", "customer_subscriptions:active_counts"];
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
  async bulkCreate(subscriptions) {
    const results = await Promise.all(
      subscriptions.map((sub) => this.create(sub).catch((err) => ({
        success: false,
        error: err.message,
        customer_id: sub.customer_id,
        subscription_id: sub.subscription_id
      })))
    );
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success);
    return {
      success: true,
      created: successful,
      failed,
      total: subscriptions.length
    };
  }
  async bulkUpdateStatus(updates) {
    const results = await Promise.all(
      updates.map((update) => this.updateStatus(update.id, update.status).catch((err) => ({
        success: false,
        error: err.message,
        id: update.id
      })))
    );
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success);
    return {
      success: true,
      updated: successful,
      failed,
      total: updates.length
    };
  }
}

const getHandler = async (context) => {
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.READ, "customer_subscriptions");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  const url = new URL(context.request.url);
  const queryValidation = validateQueryParams(url, PaginationSchema.partial());
  if (!queryValidation.success) {
    return Response.json(
      {
        message: "Invalid query parameters",
        errors: queryValidation.errors
      },
      { status: 400 }
    );
  }
  try {
    const customerSubscriptionService = new CustomerSubscriptionService(DB);
    const customerSubscriptions = await customerSubscriptionService.getAll();
    return Response.json({
      customer_subscriptions: customerSubscriptions
    });
  } catch (error) {
    console.error("Error loading customer subscriptions:", error);
    return Response.json(
      { message: "Couldn't load customer subscriptions" },
      { status: 500 }
    );
  }
};
const postHandler = async (context) => {
  const { DB } = context.locals.runtime.env;
  const authResult = await authenticate(context);
  if (authResult instanceof Response) return authResult;
  const authzMiddleware = authorize(PERMISSIONS.CREATE, "customer_subscriptions");
  const authzResult = await authzMiddleware(authResult);
  if (authzResult instanceof Response) return authzResult;
  try {
    const body = await context.request.json();
    const bodyValidation = validateRequest(CreateCustomerSubscriptionRequest, body);
    if (!bodyValidation.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: bodyValidation.errors
        },
        { status: 400 }
      );
    }
    const customerSubscriptionService = new CustomerSubscriptionService(DB);
    const serviceData = {
      customer_id: bodyValidation.data.customer_id,
      subscription_id: bodyValidation.data.subscription_id,
      status: bodyValidation.data.status,
      start_date: bodyValidation.data.subscription_starts_at,
      end_date: bodyValidation.data.subscription_ends_at
    };
    const response = await customerSubscriptionService.create(serviceData);
    if (response.success) {
      return Response.json(
        { message: "Customer subscription created successfully", success: true },
        { status: 201 }
      );
    } else {
      return Response.json(
        { message: "Couldn't create customer subscription", success: false },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating customer subscription:", error);
    return Response.json(
      { message: "Couldn't create customer subscription", success: false },
      { status: 500 }
    );
  }
};
const GET = withPerformanceMonitoring(getHandler, "customer-subscriptions:list");
const POST = withPerformanceMonitoring(postHandler, "customer-subscriptions:create");

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
//# sourceMappingURL=customer_subscriptions.astro.mjs.map
