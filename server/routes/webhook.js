import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import Course from "../models/Course.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log("✅ Webhook event received:", event.type);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Handle successful payment event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // 🔍 LOG EVERYTHING
      console.log("📦 Full session object:", JSON.stringify(session, null, 2));
      console.log("🔑 Session metadata:", session.metadata);
      console.log("👤 User ID from metadata:", session.metadata?.userId);
      console.log("📚 Course ID from metadata:", session.metadata?.courseId);

      const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;

      if (!userId || !courseId) {
        console.error("❌ Missing metadata in session");
        console.error("Session ID:", session.id);
        console.error("Available metadata:", session.metadata);
        return res.status(400).send("Missing metadata");
      }

      try {
        console.log(`🔍 Looking for user: ${userId}`);
        const user = await User.findById(userId);
        
        console.log(`🔍 Looking for course: ${courseId}`);
        const course = await Course.findById(courseId);

        if (!user) {
          console.error("❌ User not found:", userId);
          return res.status(404).send("User not found");
        }
        
        if (!course) {
          console.error("❌ Course not found:", courseId);
          return res.status(404).send("Course not found");
        }

        console.log("✅ User found:", user.email);
        console.log("✅ Course found:", course.title);
        console.log("📋 Current enrolled courses:", user.enrolledCourses);

        // Only enroll if not already enrolled
        if (!user.enrolledCourses.some(id => id.equals(course._id))) {
          user.enrolledCourses.push(course._id);
          await user.save();
          console.log(`✅ User ${user.email} enrolled in ${course.title}`);
          console.log("📋 Updated enrolled courses:", user.enrolledCourses);
        } else {
          console.log(`⚠️ User ${user.email} already enrolled in ${course.title}`);
        }
      } catch (err) {
        console.error("❌ Error enrolling user via webhook:", err);
        console.error("Error details:", err.message);
        console.error("Error stack:", err.stack);
      }
    } else {
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

export default router;