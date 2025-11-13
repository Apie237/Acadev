import dotenv from "dotenv";
dotenv.config(); // load .env before anything else

import express from "express";
import { protect } from "../middleware/auth.js";
import Course from "../models/Course.js";
import Stripe from "stripe"
import User from "../models/User.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// payments.js (you need to share this file)
// Make sure you're passing metadata correctly like this:

router.post("/create-checkout-session", protect, async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id; // From protect middleware

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: course.price * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // ✅ THIS IS CRITICAL - Make sure metadata is set correctly
      metadata: {
        userId: userId.toString(), // Convert ObjectId to string
        courseId: courseId.toString(), // Convert ObjectId to string
      },
      success_url: `${process.env.CLIENT_URL}/courses/${courseId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/courses/${courseId}`,
    });

    console.log("✅ Checkout session created:", session.id);
    console.log("📋 Metadata:", session.metadata);

    res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Error creating checkout session:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});;


router.get("/verify-session", protect, async (req, res) => {
  try {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Convert metadata strings to ObjectIds
      const courseId = mongoose.Types.ObjectId(session.metadata.courseId);
      const userId = mongoose.Types.ObjectId(session.metadata.userId);

      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Only push if not already enrolled
      if (!user.enrolledCourses.includes(course._id)) {
        user.enrolledCourses.push(course._id);
        await user.save();
      }

      res.json({ message: "Payment verified and course enrolled successfully!" });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (err) {
    console.error("Stripe verify error:", err.message);
    res.status(500).json({ message: err.message });
  }
});


export default router;
