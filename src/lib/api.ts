interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

const safeCompare = async (a: string, b: string): Promise<boolean> => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const encoder = new TextEncoder();
  const aEncoded = encoder.encode(a);
  const bEncoded = encoder.encode(b);
  if (aEncoded.length !== bEncoded.length) return false;
  // Note: timingSafeEqual is not available in Web Crypto API, using simple comparison
  // In production, use a proper timing-safe comparison
  return a === b;
};

export const validateApiTokenResponse = async (request: Request, apiToken: string): Promise<Response | undefined> => {
  const successful = await validateApiToken(request, apiToken);
  if (!successful) {
    return Response.json({ message: "Invalid API token" }, { status: 401 });
  }
};

export const validateApiToken = async (request: Request, apiToken: string): Promise<boolean> => {
  try {
    if (!request?.headers?.get) {
      console.error("Invalid request object");
      return false;
    }

    if (!apiToken) {
      console.error(
        "No API token provided. Set one as an environment variable.",
      );
      return false;
    }

    const authHeader = request.headers.get("authorization");
    const customTokenHeader = request.headers.get("x-api-token");

    let tokenToValidate = customTokenHeader;

    if (authHeader) {
      if (authHeader.startsWith("Bearer ")) {
        tokenToValidate = authHeader.substring(7);
      } else if (authHeader.startsWith("Token ")) {
        tokenToValidate = authHeader.substring(6);
      } else {
        tokenToValidate = authHeader;
      }
    }

    if (!tokenToValidate || tokenToValidate.length === 0) return false;

    return await safeCompare(apiToken.trim(), tokenToValidate.trim());
  } catch (error) {
    console.error("Error validating API token:", error);
    return false;
  }
};

export const getCustomers = async (baseUrl: string, apiToken: string): Promise<ApiResponse<{ customers: any[] }>> => {
  const url = `${baseUrl}/api/customers`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  if (response.ok) {
    const data = await response.json() as { customers: any[] };
    return {
      success: true,
      data: { customers: data.customers },
    };
  } else {
    console.error("Failed to fetch customers");
    return {
      success: false,
      data: { customers: [] },
    };
  }
};

export const getCustomer = async (id: string | number, baseUrl: string, apiToken: string): Promise<ApiResponse<{ customer: any }>> => {
  const response = await fetch(baseUrl + "/api/customers/" + id, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  if (response.ok) {
    const data = await response.json() as { customer: any };
    return {
      success: true,
      data: { customer: data.customer },
    };
  } else {
    console.error("Failed to fetch customers");
    return {
      success: false,
      data: { customer: null },
    };
  }
};

export const createCustomer = async (baseUrl: string, apiToken: string, customer: any): Promise<ApiResponse<{ customer: any }>> => {
  const response = await fetch(baseUrl + "/api/customers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });
  if (response.ok) {
    const data = await response.json() as { customer: any };
    return {
      success: true,
      data: { customer: data.customer },
    };
  } else {
    console.error("Failed to create customer");
    return {
      success: false,
      data: { customer: null },
    };
  }
};

export const createSubscription = async (baseUrl: string, apiToken: string, subscription: any): Promise<ApiResponse<{ subscription: any }>> => {
  const response = await fetch(baseUrl + "/api/subscriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  if (response.ok) {
    const data = await response.json() as { subscription: any };
    return {
      success: true,
      data: { subscription: data.subscription },
    };
  } else {
    console.error("Failed to create subscription");
    return {
      success: false,
      data: { subscription: null },
    };
  }
};

export const getSubscriptions = async (baseUrl: string, apiToken: string): Promise<ApiResponse<{ subscriptions: any[] }>> => {
  const response = await fetch(baseUrl + "/api/subscriptions", {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  if (response.ok) {
    const data = await response.json() as { subscriptions: any[] };
    return {
      success: true,
      data: { subscriptions: data.subscriptions },
    };
  } else {
    console.error("Failed to fetch subscriptions");
    return {
      success: false,
      data: { subscriptions: [] },
    };
  }
};

export const getSubscription = async (id: string | number, baseUrl: string, apiToken: string): Promise<ApiResponse<{ subscription: any }>> => {
  const response = await fetch(baseUrl + "/api/subscriptions/" + id, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  if (response.ok) {
    const data = await response.json() as { subscription: any };
    return {
      success: true,
      data: { subscription: data.subscription },
    };
  } else {
    console.error("Failed to fetch subscription");
    return {
      success: false,
      data: { subscription: null },
    };
  }
};

export const getCustomerSubscriptions = async (baseUrl: string, apiToken: string): Promise<ApiResponse<{ customer_subscriptions: any[] }>> => {
  const response = await fetch(baseUrl + "/api/customer_subscriptions", {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  if (response.ok) {
    const data = await response.json() as { customer_subscriptions: any[] };
    return {
      success: true,
      data: { customer_subscriptions: data.customer_subscriptions },
    };
  } else {
    console.error("Failed to fetch customer subscriptions");
    return {
      success: false,
      data: { customer_subscriptions: [] },
    };
  }
};

export const runCustomerWorkflow = async (id: string | number, baseUrl: string, apiToken: string): Promise<ApiResponse> => {
  const response = await fetch(baseUrl + `/api/customers/${id}/workflow`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    method: "POST",
  });
  if (response.ok) {
    const data = await response.json();
    return {
      success: true,
    };
  } else {
    console.error("Failed to fetch customer subscriptions");
    return {
      success: false,
    };
  }
};
