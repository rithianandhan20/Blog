const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config(); // load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json()); // parse JSON bodies

// --- Serve uploaded images statically ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Ensure uploads folder exists ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });
// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB connection error:', err));

// --- Blog model ---
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: String,
  createdAt: { type: Date, default: Date.now }
});
const Blog = mongoose.model('Blog', blogSchema);

// --- Routes ---

// Test route
app.get('/', (req, res) => res.send('Flower Blog Backend Running'));

// Create blog
app.post('/blogs', upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;
    if (!title || !subtitle || !content) {
      return res.status(400).json({ message: 'Title, Subtitle and Content are required' });
    }

    const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

const newBlog = new Blog({ title, subtitle, content, imagePath });
    await newBlog.save();

    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all blogs (newest first)
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Serve frontend in production ---
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, 'plantaid-frontend', 'build');
  app.use(express.static(frontendPath));

  // This handles all frontend routes correctly
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// --- Start server ---
app.listen(PORT,() => console.log('Server running on http://localhost:${PORT}'));