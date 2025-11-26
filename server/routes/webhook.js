import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import Course from "../models/Course.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// IMPORTANT: express.raw() MUST be used only on this route, not globally
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("\n🎯 ====== STRIPE WEBHOOK RECEIVED ======");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log("✅ Webhook verified. Event:", event.type);
    } catch (err) {
      console.error("❌ Webhook verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 🎉 ---- Handle Successful Checkout ----
    if (
  event.type === "checkout.session.completed" ||
  event.type === "checkout.session.async_payment_succeeded"
) {
  console.log("\n💳 Checkout completed (or async) – enrolling user...");

  const session = event.data.object;

  const userId = session.metadata?.userId;
  const courseId = session.metadata?.courseId;

  console.log("🧩 Metadata:", { userId, courseId });

  if (!userId || !courseId) {
    console.log("❌ Missing metadata. Aborting enrollment.");
    return res.status(400).send("Missing metadata");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).send("User not found");
    }

    const already = user.enrolledCourses.includes(courseId);

    if (already) {
      console.log("⚠️ Already enrolled");
      return res.status(200).send("Already enrolled");
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    console.log("✅ Enrollment saved!");
  } catch (err) {
    console.error("❌ Enrollment error:", err);
  }
}

    res.json({ received: true });
  }
);

export default router;
