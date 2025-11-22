import express from "express";
import Transcript from "../models/Transcript.js";

const router = express.Router();

// POST /api/assistant
router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    // 🔹 Here you could integrate a real LLM or OpenAI API
    const reply = `Hello! I'm Beacon. You asked: "${message}". I can guide you around LearnHub!`;

    // Save transcript (stub)
    if (userId) {
      let transcript = await Transcript.findOne({ userId });
      if (!transcript) {
        transcript = new Transcript({ userId, messages: [] });
      }
      transcript.messages.push({ role: "user", content: message });
      transcript.messages.push({ role: "assistant", content: reply });
      await transcript.save();
    }

    res.json({ reply });
  } catch (err) {
    console.error("Assistant error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
