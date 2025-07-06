import type { APIRoute } from "astro";
import { validateApiTokenResponse } from "@/lib/api";
import { SubscriptionService } from "@/lib/services/subscription";
import { validateRequest, CreateSubscriptionRequest } from "@/lib/schemas/api-validation";

export const GET: APIRoute = async ({ locals, params, request }) => {
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const subscriptionService = new SubscriptionService(DB);

  try {
    const subscriptions = await subscriptionService.getAll();
    return Response.json({ subscriptions });
  } catch (error) {
    return Response.json(
      { message: "Couldn't load subscriptions" },
      { status: 500 },
    );
  }
}

export const POST: APIRoute = async ({ locals, request }) => {
  const { API_TOKEN, DB } = locals.runtime.env;

  const invalidTokenResponse = await validateApiTokenResponse(
    request,
    API_TOKEN,
  );
  if (invalidTokenResponse) return invalidTokenResponse;

  const subscriptionService = new SubscriptionService(DB);

  try {
    const body = await request.json();
    
    // Validate request body using Zod schema
    const validation = validateRequest(CreateSubscriptionRequest, body);
    
    if (!validation.success) {
      return Response.json(
        {
          message: "Invalid request data",
          errors: validation.errors
        },
        { status: 400 }
      );
    }

    await subscriptionService.create(validation.data);
    return Response.json(
      {
        message: "Subscription created successfully",
        success: true,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      {
        message: error instanceof Error ? error.message : "Failed to create subscription",
        success: false,
      },
      { status: 500 },
    );
  }
}
