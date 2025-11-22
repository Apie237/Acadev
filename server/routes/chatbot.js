import express from "express";
import { protect } from "../middleware/auth.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Progress from "../models/Progress.js";

const router = express.Router();

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = "microsoft/DialoGPT-medium";

const callHuggingFace = async (prompt) => {
  try {
    const response = await fetch(
      `https://router.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HF API error ${response.status}:`, errorText);
      throw new Error(`HF API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    } else if (data.generated_text) {
      return data.generated_text;
    } else {
      console.error("Unexpected HF response format:", data);
      return "I'm sorry, I couldn't generate a response. Please try asking differently.";
    }
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw error;
  }
};

const getUserContext = async (userId) => {
  try {
    const user = await User.findById(userId).populate("enrolledCourses");
    const progress = await Progress.find({ user: userId });
    
    return {
      enrolledCourses: user.enrolledCourses.map(c => c.title),
      totalCourses: user.enrolledCourses.length,
      progressData: progress.map(p => ({
        course: p.course,
        completed: p.completedLessons.length,
      })),
    };
  } catch (error) {
    console.error("Error fetching user context:", error);
    return { enrolledCourses: [], totalCourses: 0, progressData: [] };
  }
};

const getPlatformContext = async () => {
  try {
    const courses = await Course.find({ published: true }).select("title category description");
    const categories = [...new Set(courses.map(c => c.category))];
    
    return {
      totalCourses: courses.length,
      categories,
      availableCourses: courses.map(c => ({
        title: c.title,
        category: c.category,
      })),
    };
  } catch (error) {
    console.error("Error fetching platform context:", error);
    return { totalCourses: 0, categories: [], availableCourses: [] };
  }
};

const buildPrompt = (userMessage, userContext, platformContext) => {
  const contextInfo = `Platform has ${platformContext.totalCourses} courses in ${platformContext.categories.join(", ")}. User enrolled in: ${userContext.enrolledCourses.join(", ") || "none"}.`;
  
  return `${contextInfo}\nUser: ${userMessage}\nBeaconAI:`;
};

router.post("/chat", protect, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("📨 Received message:", message);

    const userContext = await getUserContext(req.user._id);
    const platformContext = await getPlatformContext();

    const quickResponse = getQuickResponse(message.toLowerCase(), userContext, platformContext);
    if (quickResponse) {
      console.log("⚡ Using quick response");
      return res.json({ 
        response: quickResponse.text,
        suggestions: quickResponse.suggestions || [],
        action: quickResponse.action || null,
      });
    }

    const prompt = buildPrompt(message, userContext, platformContext);

    console.log("🤖 Calling Hugging Face API...");
    
    const aiResponse = await Promise.race([
      callHuggingFace(prompt),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("AI request timeout")), 10000)
      )
    ]);

    console.log("✅ AI Response received");

    const suggestions = generateSuggestions(message, userContext, platformContext);

    res.json({
      response: aiResponse,
      suggestions,
      action: null,
    });

  } catch (error) {
    console.error("Chat error:", error);
    
    const fallbackResponse = getFallbackResponse(req.body.message);
    
    res.json({ 
      response: fallbackResponse.text,
      suggestions: fallbackResponse.suggestions || [
        "Show me my courses",
        "How do I enroll?",
        "View my progress"
      ],
      action: null,
    });
  }
});

const getQuickResponse = (message, userContext, platformContext) => {
  if (message.includes("enrolled courses") || message.includes("my courses")) {
    return {
      text: userContext.totalCourses > 0
        ? `You're currently enrolled in ${userContext.totalCourses} course(s): ${userContext.enrolledCourses.join(", ")}. Would you like to continue learning?`
        : "You haven't enrolled in any courses yet. Would you like me to recommend some based on your interests?",
      suggestions: userContext.totalCourses > 0 
        ? ["Continue learning", "View my progress", "Browse more courses"]
        : ["Show me Cybersecurity courses", "Show me Data Science courses", "View all courses"],
      action: userContext.totalCourses > 0 ? { type: "link", path: "/my-courses", label: "Go to My Courses" } : null,
    };
  }

  if (message.includes("how to enroll") || message.includes("buy course") || message.includes("purchase")) {
    return {
      text: "To enroll in a course:\n1. Browse available courses from the Dashboard\n2. Click on a course to view details\n3. Click the 'Buy Now' button\n4. Complete the payment process\n5. Start learning immediately!",
      suggestions: ["Browse courses", "View my enrolled courses", "What courses are available?"],
      action: { type: "link", path: "/dashboard", label: "Browse Courses" },
    };
  }

  if (message.includes("progress") || message.includes("how am i doing")) {
    return {
      text: "You can track your progress by visiting the Progress page. It shows completion percentage, completed lessons, and your learning streak!",
      suggestions: ["View my progress", "Continue learning", "Show my courses"],
      action: { type: "link", path: "/progress", label: "View My Progress" },
    };
  }

  if (message.includes("dashboard") || message.includes("home")) {
    return {
      text: "The Dashboard is your home base! It shows your enrolled courses, recent activity, and recommended courses to explore.",
      suggestions: ["Go to Dashboard", "View my courses", "Show recommendations"],
      action: { type: "link", path: "/dashboard", label: "Go to Dashboard" },
    };
  }

  if (message.includes("cybersecurity") || message.includes("security course")) {
    const securityCourses = platformContext.availableCourses.filter(c => 
      c.category.toLowerCase().includes("security") || c.category.toLowerCase().includes("cyber")
    );
    
    if (securityCourses.length > 0) {
      return {
        text: `We have ${securityCourses.length} Cybersecurity course(s):\n${securityCourses.map(c => `• ${c.title}`).join("\n")}\n\nWould you like to explore them?`,
        suggestions: ["Browse Cybersecurity courses", "Show all courses", "Recommend a course"],
        action: { type: "link", path: "/dashboard", label: "Browse Courses" },
      };
    }
  }

  if (message.includes("data science") || message.includes("data course")) {
    const dataCourses = platformContext.availableCourses.filter(c => 
      c.category.toLowerCase().includes("data")
    );
    
    if (dataCourses.length > 0) {
      return {
        text: `We have ${dataCourses.length} Data Science course(s):\n${dataCourses.map(c => `• ${c.title}`).join("\n")}\n\nWould you like to explore them?`,
        suggestions: ["Browse Data Science courses", "Show all courses", "Recommend a course"],
        action: { type: "link", path: "/dashboard", label: "Browse Courses" },
      };
    }
  }

  if (message.includes("all courses") || message.includes("available courses") || message.includes("what courses")) {
    return {
      text: `We currently offer ${platformContext.totalCourses} courses across ${platformContext.categories.length} categories: ${platformContext.categories.join(", ")}.\n\nPopular courses include:\n${platformContext.availableCourses.slice(0, 3).map(c => `• ${c.title}`).join("\n")}`,
      suggestions: ["View all courses", "Show Cybersecurity courses", "Show Data Science courses"],
      action: { type: "link", path: "/dashboard", label: "View All Courses" },
    };
  }

  if (message.includes("help") || message.includes("what can you do")) {
    return {
      text: "I can help you with:\n• Finding and enrolling in courses\n• Tracking your learning progress\n• Navigating the platform\n• Answering questions about features\n\nWhat would you like to know?",
      suggestions: ["Show my courses", "How do I enroll?", "View my progress", "Show all courses"],
    };
  }

  return null;
};

const getFallbackResponse = (message) => {
  return {
    text: "I'm here to help! You can ask me about:\n• Your enrolled courses\n• How to enroll in new courses\n• Tracking your progress\n• Available courses on the platform\n\nWhat would you like to know?",
    suggestions: ["Show my courses", "How do I enroll?", "View my progress", "Show all courses"],
  };
};

const generateSuggestions = (message, userContext, platformContext) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("course") || lowerMessage.includes("learn")) {
    return [
      "Show me Cybersecurity courses",
      "Show me Data Science courses",
      "What's popular right now?",
    ];
  }

  if (lowerMessage.includes("progress") || lowerMessage.includes("complete")) {
    return [
      "View my progress",
      "Continue where I left off",
      "Show my enrolled courses",
    ];
  }

  return [
    "Browse courses",
    "View my enrolled courses",
    "Show my progress",
  ];
};

router.get("/recommendations", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledCourses");
    const enrolledIds = user.enrolledCourses.map(c => c._id.toString());

    const recommendations = await Course.find({
      published: true,
      _id: { $nin: enrolledIds },
    }).limit(3);

    res.json(recommendations);
  } catch (error) {
    console.error("Recommendations error:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

export default router;