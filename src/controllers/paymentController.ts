import { Request, Response } from "express";
import { getStripeService } from "../services/payment/StripeService";
import { User } from "../models/User";
import { Subscription } from "../models/Subscription";
import { ApiResponse } from "../types";
import { logger } from "../utils/logger";

/**
 * Create Stripe checkout session for subscription
 * Supports optional affiliateCode (stored in Stripe metadata)
 */
export const createCheckoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      } as ApiResponse);
      return;
    }

    const { priceId, successUrl, cancelUrl, affiliateCode } = req.body as {
      priceId?: string;
      successUrl?: string;
      cancelUrl?: string;
      affiliateCode?: string;
    };

    if (!priceId) {
      res.status(400).json({
        success: false,
        error: { message: "priceId is required" },
      } as ApiResponse);
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: "User not found" },
      } as ApiResponse);
      return;
    }

    const stripeService = getStripeService();

    // Ensure Stripe customer exists
    if (!user.stripeCustomerId) {
      const customer = await stripeService.createCustomer({
        email: user.email,
        metadata: { userId: user._id.toString() },
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const session = await stripeService.createCheckoutSession({
      mode: "subscription",
      customer: user.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        successUrl ||
        "http://localhost:3001/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl || "http://localhost:3001/cancel",
      metadata: {
        userId: user._id.toString(),
        ...(affiliateCode
          ? { affiliateCode: affiliateCode.trim().toUpperCase() }
          : {}),
      },
    });

    res.json({
      success: true,
      data: { sessionId: session.id, url: session.url },
    } as ApiResponse);
  } catch (error: any) {
    logger.error("Error creating checkout session", {
      service: "sports-degens-backend",
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: { message: error.message },
    } as ApiResponse);
  }
};

/**
 * Get subscription status
 */
export const getSubscriptionStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      } as ApiResponse);
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: "User not found" },
      } as ApiResponse);
      return;
    }

    const activeSubscription = await Subscription.findOne({
      userId: user._id,
      status: "active",
    });

    res.json({
      success: true,
      data: {
        hasSubscription: Boolean(activeSubscription),
        hasToolsAccess: Boolean(user.hasToolsAccess),
        toolsSubscriptionExpiry: user.toolsSubscriptionExpiry || null,
      },
    } as ApiResponse);
  } catch (error: any) {
    logger.error("Error getting subscription status", {
      service: "sports-degens-backend",
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: { message: error.message },
    } as ApiResponse);
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: { message: "Unauthorized" },
      } as ApiResponse);
      return;
    }

    const subscription = await Subscription.findOne({
      userId,
      status: "active",
    });
    if (!subscription) {
      res.status(404).json({
        success: false,
        error: { message: "Active subscription not found" },
      } as ApiResponse);
      return;
    }

    const stripeService = getStripeService();
    await stripeService.cancelSubscription(subscription.stripeSubscriptionId);

    subscription.status = "canceled";
    await subscription.save();

    res.json({ success: true, data: { canceled: true } } as ApiResponse);
  } catch (error: any) {
    logger.error("Error canceling subscription", {
      service: "sports-degens-backend",
      error: error.message,
    });
    res.status(500).json({
      success: false,
      error: { message: error.message },
    } as ApiResponse);
  }
};

/**
 * Stripe webhook handler
 */
export const handleStripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const signature = (req.headers["stripe-signature"] as string) || "";
    const rawBody = (req as any).rawBody as Buffer | undefined;

    if (!rawBody) {
      // If your express setup doesn't provide raw body yet, accept but warn.
      logger.warn(
        "Stripe webhook received without raw body (signature verification skipped)",
        {
          service: "sports-degens-backend",
        }
      );
      res.status(200).json({ received: true });
      return;
    }

    const stripeService = getStripeService();
    const event = await stripeService.constructEvent(rawBody, signature);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const userId = session?.metadata?.userId;
      const affiliateCode = (session?.metadata?.affiliateCode || "")
        .trim()
        .toUpperCase();

      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          // Example: grant tools access on successful checkout
          user.hasToolsAccess = true;
          user.toolsSubscriptionExpiry = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          );

          // Affiliate linking (one-time, no new models)
          if (affiliateCode && !user.referredBy) {
            const referrer = await User.findOne({ affiliateCode });
            if (referrer && referrer._id.toString() !== user._id.toString()) {
              user.referredBy = referrer._id;
            }
          }

          await user.save();
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    logger.error("Stripe webhook error", {
      service: "sports-degens-backend",
      error: error.message,
    });
    res.status(400).json({
      success: false,
      error: { message: error.message },
    } as ApiResponse);
  }
};
