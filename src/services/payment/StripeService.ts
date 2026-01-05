import Stripe from "stripe";
import { logger } from "../../utils/logger";

/**
 * Stripe service with lazy initialization.
 * Do NOT instantiate Stripe at module import time.
 */
export class StripeService {
  private stripe?: Stripe;

  private getClient(): Stripe {
    const secretKey = (process.env.STRIPE_SECRET_KEY || "").trim();
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    if (!this.stripe) {
      this.stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
      logger.info("Stripe client initialized", {
        service: "sports-degens-backend",
      });
    }
    return this.stripe;
  }

  async createCustomer(params: Stripe.CustomerCreateParams) {
    return this.getClient().customers.create(params);
  }

  async createCheckoutSession(params: Stripe.Checkout.SessionCreateParams) {
    return this.getClient().checkout.sessions.create(params);
  }

  async cancelSubscription(subscriptionId: string) {
    return this.getClient().subscriptions.cancel(subscriptionId);
  }

  async constructEvent(rawBody: Buffer, signature: string) {
    const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim();
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }
    return this.getClient().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  }
}

let _stripeService: StripeService | null = null;

export function getStripeService(): StripeService {
  if (!_stripeService) _stripeService = new StripeService();
  return _stripeService;
}
