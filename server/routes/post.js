// routes/post.js
import express from "express";
import { protect } from "../middleware/auth.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Create Post
router.post("/create", protect, async (req, res) => {
  try {
    const { text, courseId } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is enrolled in the course
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({ message: "You must be enrolled in this course to post" });
    }

    if (!img && !text) {
      return res.status(400).json({ message: "Post must have text or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      course: courseId,
      img,
      text,
    });

    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in create post: ", error);
  }
});

// Delete Post
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Comment on Post
router.post("/comment/:id", protect, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    // Create notification for post owner
    if (post.user.toString() !== userId.toString()) {
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "comment",
        post: postId,
      });
      await notification.save();
    }

    res.status(201).json(post);
  } catch (error) {
    console.log("Error in commentOnPost: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Like/Unlike Post
router.post("/like/:id", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
      res.status(200).json(updatedLikes);
    } else {
      post.likes.push(userId);
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
        post: postId,
      });
      await notification.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in likeUnlikePost: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Course Posts
router.get("/course/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Check if user is enrolled in the course
    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(403).json({ error: "You must be enrolled to view course posts" });
    }

    const posts = await Post.find({ course: courseId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getCoursePosts: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get User Posts
router.get("/user/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;