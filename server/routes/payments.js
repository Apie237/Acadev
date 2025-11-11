import dotenv from "dotenv";
dotenv.config(); // load .env before anything else

import express from "express";
import { protect } from "../middleware/auth.js";
import Course from "../models/Course.js";
import Stripe from "stripe"
import User from "../models/User.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ message: "Course ID required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Prevent enrolling twice by checking enrolledCourses array
    const user = req.user;
    if (user.enrolledCourses?.includes(course._id.toString())) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: course.title },
            unit_amount: Math.round(parseFloat(course.price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.LEARNHUB_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/courses/${course._id}`,
      metadata: {
        userId: user._id.toString(),
        courseId: course._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err.message);
    res.status(500).json({ message: err.message });
  }
});


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
