const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// Middleware
// --------------------
app.use(cors({
  origin: "*", // ⚠️ In production, replace "*" with your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

// --------------------
// MongoDB Connection
// --------------------
mongoose.connect(
  process.env.MONGO_URI ||
    "mongodb+srv://rithianandhan20:hjMTApwivwBgdNpI@cluster0.ryc7mvr.mongodb.net/fishblogdb?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// --------------------
// Schema & Model
// --------------------
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

// --------------------
// Routes
// --------------------

// Root route
app.get("/", (req, res) => {
  res.send("🎉 Server running!");
});

// CREATE blog
app.post("/api/blogs", async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;
    if (!title || !subtitle || !content) {
      return res.status(400).json({ error: "Title, Subtitle, and Content are required" });
    }
    const newBlog = new Blog({ title, subtitle, content });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error("❌ Error submitting blog:", err);
    res.status(500).json({ error: "Failed to submit blog" });
  }
});

// READ all blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("❌ Error fetching blogs:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// READ single blog by ID (optional but useful)
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    console.error("❌ Error fetching blog:", err);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// UPDATE blog
app.put("/api/blogs/:id", async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Blog not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating blog:", err);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// DELETE blog
app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    console.error("❌ Error deleting blog:", err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

// Serve uploaded images (if needed later)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server listening at https://rithi.onrender.com`);
});