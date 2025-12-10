import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import assistantRoutes from "./routes/assistant.js";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import lessonRoutes from "./routes/lessons.js";
import progressRoutes from "./routes/progress.js";
import paymentRoutes from "./routes/payments.js";
import userRoutes from "./routes/user.js";
import webhookRoutes from "./routes/webhook.js";
import chatbotRoutes from "./routes/chatbot.js";
import postRoutes from "./routes/post.js";
import notificationRoutes from "./routes/notification.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS first
app.use(cors({
  origin: [process.env.CLIENT_URL, process.env.ADMIN_URL, process.env.LEARNHUB_URL],
}));

// ✅ Stripe webhook route BEFORE any body parsers
// This must come BEFORE express.json()
app.use("/api/webhook", webhookRoutes);

// ✅ JSON parser for normal routes (comes AFTER webhook)
app.use(express.json({ limit: "10mb" }));

// ✅ Simple test route
app.get("/", (req, res) => {
  res.send("🚀 Acadevo LMS Server is running!");
});

// ✅ Normal API routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));