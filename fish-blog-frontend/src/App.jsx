import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogForm from './components/BlogForm';
import './App.css';

function Home() {
  return (
    <div className="fullscreen">   {/* always fills screen */}
      <div className="container">   {/* layout spacing */}
        <div className="card">      {/* pretty box */}
          <h1>🐠 Welcome to Aquatic Insights 🐡🐟</h1>
          <h2>📝 Latest Posts</h2>
          <p>1. “Top 5 Beginner Fish That Are Easy to Care For”<br /> 🐬 Beautiful, hardy, and peaceful — perfect for beginners!</p>
          <p>2. “How to Control Algae in Your Aquarium”<br /> 🐙 Practical tips to prevent and treat algae growth naturally.</p>
          <p>3. “Feeding Schedule: How Often Should You Feed Tropical Fish?”<br /> 🐛🪱 Avoid overfeeding. Set the perfect routine!</p>
          <p>4. “What to Do When Your Fish Stops Eating”<br /> 😟 Appetite loss = stress or illness. Here's how to fix it.</p>
          <p>5. “DIY Aquarium Decor”<br /> 🐚 Create a unique underwater world without harming your fish. 🐳</p>

          <h2>🌟 Featured Fish of the Month 🌟</h2>
          <p>🐠 <strong>Betta Splendens</strong> (Betta Fish) - Vibrant, flowing fins & perfect for solo tanks. Great for beginners!</p>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="fullscreen">
      <div className="container">
        <div className="card">
          <h1>📖 About Aquatic Insights 📖</h1>
          <p>
            🌊🔍 Welcome to Fish Caring Blog, your trusted source for fish care tips! <br />
            Whether you're a newbie or a pro aquarist, we help ensure your fish thrive in a beautiful environment. 🐟✨<br /><br />
            📞 Contact Us:<br />
            ☎️ Phone: 9867xxxxxx<br />
            📧 Email: aquaticInsights25@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">🏠 Home</Link>
        <Link to="/blog">📝 Blog</Link>
        <Link to="/about">📖 About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogForm />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;