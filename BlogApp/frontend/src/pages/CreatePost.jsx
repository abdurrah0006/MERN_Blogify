import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import "../styles/CreatePost.css";

const categories = [
  "Destination",
  "Travel",
  "Lifestyle",
  "Adventure",
  "Food",
];

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    category: categories[0],
  });

  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();

      submitData.append("title", formData.title);
      submitData.append("content", formData.content);
      submitData.append("tags", formData.category);

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      await API.post("/posts", submitData);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-page">

      {/* LEFT SIDE */}
      <div className="create-left-side">

        <div
          className="create-left-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80")',
          }}
        />

        <div className="create-logo">
          <div className="create-logo-box">B</div>
          <span>Blogify</span>
        </div>

        <div className="create-hero-text">
          <h1>
            Write.
            <br />
            Share.
          </h1>

          <p>
            Create meaningful stories, share your adventures, and inspire the
            Blogify community through beautiful writing.
          </p>
        </div>

        <div className="create-footer-text">
          ©2026 Blogify. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="create-right-side">

        <div className="create-form-wrapper">

          {/* HEADER */}
          <div className="create-heading">
            <h2>Create New Post</h2>
            <p>Publish your next story to the world.</p>
          </div>

          {/* FORM */}
          <form onSubmit={submitHandler} className="create-form">

            {/* TITLE */}
            <div>
              <label>Post Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter your post title..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* IMAGE */}
            <div>
              <label>Cover Image</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />

              <p className="input-note">
                Upload a high quality image for your blog cover.
              </p>
            </div>

            {/* PREVIEW */}
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="image-preview"
              />
            )}

            {/* CATEGORY */}
            <div>
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="category-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* CONTENT */}
            <div>
              <label>Blog Content</label>

              <textarea
                rows="10"
                name="content"
                placeholder="Write your story here..."
                value={formData.content}
                onChange={handleChange}
              />
            </div>

            {/* BUTTONS */}
            <div className="button-group">

              <button type="submit" className="publish-btn">
                Publish Post
              </button>

              <button type="button" className="draft-btn">
                Save Draft
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;