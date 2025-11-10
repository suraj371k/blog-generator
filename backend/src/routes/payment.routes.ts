import express, { Router } from "express";
import {
  createCheckoutSession,
  stripeWebhook,
  verifyPaymentSession,
} from "../controllers/payment.controller.js";
import { authenticateMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/create-checkout-session",
  authenticateMiddleware,
  createCheckoutSession
);

//  Webhook route with RAW body 
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

router.get("/verify-session", authenticateMiddleware, verifyPaymentSession);

export default router;