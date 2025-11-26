import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import Course from "../models/Course.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Keep express.raw() HERE in the route handler
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("\n🎯 ========== WEBHOOK RECEIVED ==========");
    
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log("✅ Webhook signature verified");
      console.log("📧 Event type:", event.type);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("📦 Event received:", event.type);

    if (event.type === "checkout.session.completed") {
      console.log("\n💳 CHECKOUT SESSION COMPLETED - Starting enrollment");
      
      const session = event.data.object;
      
      console.log("🔑 Metadata:", session.metadata);

      const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;

      console.log("👤 UserId from metadata:", userId);
      console.log("📚 CourseId from metadata:", courseId);

      if (!userId || !courseId) {
        console.error("❌ CRITICAL: Missing metadata in session");
        return res.status(400).send("Missing metadata");
      }

      try {
        console.log("🔍 Looking up user with ID:", userId);
        const user = await User.findById(userId);
        
        console.log("🔍 Looking up course with ID:", courseId);
        const course = await Course.findById(courseId);

        if (!user) {
          console.error("❌ User not found in database:", userId);
          return res.status(404).send("User not found");
        }
        
        if (!course) {
          console.error("❌ Course not found in database:", courseId);
          return res.status(404).send("Course not found");
        }

        console.log("✅ User found:", user.email);
        console.log("✅ Course found:", course.title);
        console.log("📚 User's current enrolled courses:", user.enrolledCourses);

        // Check if already enrolled
        const alreadyEnrolled = user.enrolledCourses.some(id => 
          id.toString() === course._id.toString()
        );

        if (!alreadyEnrolled) {
          console.log("➕ Adding course to user's enrolled courses");
          user.enrolledCourses.push(course._id);
          
          console.log("💾 Saving user...");
          await user.save();
          
          console.log("✅✅✅ SUCCESS: User enrolled in course!");
          console.log("📚 Updated enrolled courses:", user.enrolledCourses);
        } else {
          console.log("⚠️ User already enrolled in this course");
        }

        return res.status(200).json({ received: true, enrolled: true });

      } catch (err) {
        console.error("❌❌❌ CRITICAL ERROR during enrollment:", err);
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        return res.status(500).json({ error: "Failed to enroll user", details: err.message });
      }
    }

    console.log("✅ Webhook processed (non-checkout event)");
    res.status(200).json({ received: true });
  }
);

export default router;