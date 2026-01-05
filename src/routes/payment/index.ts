import express, { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import {
  createCheckoutSession,
  getSubscriptionStatus,
  cancelSubscription,
  handleStripeWebhook,
} from '../../controllers/paymentController';

const router = Router();

// Webhook route (no auth required, uses Stripe signature)
// Must use raw body for Stripe signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// All other payment routes require authentication
router.use(authenticate);

// Payment routes
router.post('/create-checkout-session', createCheckoutSession);
router.get('/subscription-status', getSubscriptionStatus);
router.post('/cancel-subscription', cancelSubscription);

export default router;
