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
    if (event.type === "checkout.session.completed") {
      console.log("\n💳 Checkout session completed – enrolling user...");

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
        const course = await Course.findById(courseId);

        if (!user) {
          console.log("❌ User not found:", userId);
          return res.status(404).send("User not found");
        }

        if (!course) {
          console.log("❌ Course not found:", courseId);
          return res.status(404).send("Course not found");
        }

        // 🛑 Prevent duplicate enrollment
        const alreadyEnrolled = user.enrolledCourses.some(
          (c) => c.toString() === courseId.toString()
        );

        if (alreadyEnrolled) {
          console.log("⚠️ User already enrolled. Skipping...");
          return res.status(200).send("Already enrolled");
        }

        // 🎉 ENROLL USER
        user.enrolledCourses.push(courseId);
        await user.save();

        console.log("✅ User successfully enrolled:", userId);
      } catch (err) {
        console.error("❌ Enrollment error:", err.message);
        return res.status(500).send("Enrollment failed");
      }
    }

    res.json({ received: true });
  }
);

export default router;
