
const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.json({
      id: blog._id,         // ✅ Apollo needs this
      title: blog.title,
      subtitle: blog.subtitle,
      content: blog.content,
      createdAt: blog.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save blog" });
  }
});
// Middleware
app.use(cors({
  origin: "https://aquatic-j7rc.onrender.com", // ✅ frontend origin only
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

// Connect MongoDB
mongoose.connect(
  process.env.MONGO_URI ||
    "mongodb+srv://rithianandhan20:hjMTApwivwBgdNpI@cluster0.ryc7mvr.mongodb.net/fishblogdb?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Schema
const blogSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    content: String,
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

// Routes
app.get("/", (req, res) => {
  res.send("🎉 Server running!");
});

// CREATE blog
app.post("/blogs", async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;
    if (!title || !subtitle || !content) {
      return res
        .status(400)
        .json({ error: "Title, Subtitle, and Content are required" });
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
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// UPDATE blog
app.put("/blogs/:id", async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// DELETE blog
app.delete("/blogs/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:5000`);
});