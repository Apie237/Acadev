import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { protect } from "../middleware/auth.js";
import Course from "../models/Course.js";
import Stripe from "stripe";
import User from "../models/User.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", protect, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ FIX: Properly convert to integer cents to avoid floating point errors
    const priceInCents = Math.round(parseFloat(course.price) * 100);
    
    console.log("💰 Course price:", course.price);
    console.log("💵 Price in cents:", priceInCents);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description,
              images: course.thumbnail || course.imageUrl ? [course.thumbnail || course.imageUrl] : [],
            },
            unit_amount: priceInCents, // ✅ Now properly rounded integer
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: userId.toString(),
        courseId: courseId.toString(),
      },
      success_url: `${process.env.LEARNHUB_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/courses/${courseId}`,
    });

    console.log("✅ Checkout session created:", session.id);
    console.log("📋 Metadata:", session.metadata);

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating checkout session:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/verify-session", protect, async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ message: "Session ID required" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const courseId = session.metadata.courseId;
      const userId = session.metadata.userId;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only push if not already enrolled
      if (!user.enrolledCourses.some(id => id.equals(course._id))) {
        user.enrolledCourses.push(course._id);
        await user.save();
        console.log(`✅ User ${user.email} enrolled in ${course.title} via verify-session`);
      }

      res.json({ 
        message: "Payment verified and course enrolled successfully!",
        enrolled: true 
      });
    } else {
      res.status(400).json({ 
        message: "Payment not completed",
        status: session.payment_status 
      });
    }
  } catch (err) {
    console.error("❌ Stripe verify error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;