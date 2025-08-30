import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://rithi.onrender.com/api';


export default function BlogForm() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subtitle.trim() || !content.trim()) {
      const res = await axios.post(`${BACKEND_URL}/blogs`, blogData);
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const blogData = {
        title,
        subtitle,
        content
      };

      if (editId) {
        await axios.put(`${BACKEND_URL}/blogs/${editId}`, blogData);
        setEditId(null);
      } else {
        const res = await axios.post(`${BACKEND_URL}/blogs`, blogData);
        setBlogs(prev => [res.data, ...prev]);
      }

      setTitle('');
      setSubtitle('');
      setContent('');
      fetchBlogs();
    } catch (err) {
      console.error('Error submitting blog:', err);
      alert('Failed to submit blog');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    const [mainTitle, sub] = blog.title.split(' — ');
    setTitle(mainTitle || blog.title);
    setSubtitle(blog.subtitle);
    setContent(blog.content);
    setEditId(blog._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${BACKEND_URL}/blogs/${id}`);

        setBlogs(blogs.filter(b => b._id !== id));
      } catch (err) {
        console.error('Error deleting blog:', err);
        alert('Failed to delete blog');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{editId ? '✏️ Edit Blog Post' : '📝 Write a New Blog Post'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          📌 TITLE:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            required
          />
        </label>
        <br /><br />
        <label>
          🖋️ SUBTITLE:
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter subtitle"
            required
          />
        </label>
        <br /><br />
        <label>
          🧾 CONTENT:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your content here..."
            rows={5}
            required
          />
        </label>
        <br /><br />
        <button type="submit" disabled={loading}>
          🚀 {loading ? 'Submitting...' : editId ? 'Update' : 'Submit'}
        </button>
      </form>

      <h2 style={{ marginTop: '40px' }}>📚 Submitted Posts</h2>
      {blogs.length === 0 ? (
        <p>🧐 No posts yet. Start writing!</p>
      ) : (
        blogs.map((post) => (
          <div key={post._id} className="blog-post" style={{ border: '2px solid #4fc3f7', margin: '10px', padding: '10px', borderRadius: '10px' }}>
            <h3>📝 {post.title}</h3>
            <h4>🔖 {post.subtitle}</h4>
            <p>{post.content}</p>
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => handleEdit(post)} style={{ marginRight: '10px' }}>✏️ Edit</button>
              <button onClick={() => handleDelete(post._id)}>🗑️ Delete</button>
            </div>
            <small>🕒 {new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}