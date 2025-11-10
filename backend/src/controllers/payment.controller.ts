import { Request, Response } from "express";
import Stripe from "stripe";
import User from "../models/user.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { plan } = req.body;

    if (!["pro", "enterprise"].includes(plan)) {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    const prices: Record<string, string> = {
      pro: process.env.STRIPE_PRO_PRICE_ID!,
      enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price: prices[plan],
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing/cancel`,
      metadata: {
        userId: user._id.toString(),
        plan,
      },
    });
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.log("Error in payment creation", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as any;
      const { userId, plan } = session.metadata;

      await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            plan,
            "apiUsage.lastReset": new Date(),
          },
        },
        { new: true } // returns updated document
      );

      console.log(`✅ Updated user ${userId} to plan ${plan}`);
      break;
  }
  res.status(200).json({ received: true });
};

export const verifyPaymentSession = async (req: Request, res: Response) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res
        .status(400)
        .json({ success: false, message: "session id is required" });
    }

    //retrieve the session from the stripe
    const session = await stripe.checkout.sessions.retrieve(
      session_id as string,
      {
        expand: ["subscription"],
      }
    );

    if (!session) {
      return res
        .status(400)
        .json({ success: false, message: "session not found" });
    }

    //check if payment was successfull
    if (session.payment_status === "paid") {
      return res.json({
        success: true,
        session: {
          id: session.id,
          payment_status: session.payment_status,
          customer: session.customer,
          subsciption: session.subscription,
        },
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.log("Error in verify payment controller", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
