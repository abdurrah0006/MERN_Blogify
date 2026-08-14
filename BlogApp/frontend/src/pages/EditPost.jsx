import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API from "../api/axios";

import "../styles/EditPost.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: "",
  });

  useEffect(() => {
    let isMounted = true;

    API.get(`/posts/${id}`)
      .then(({ data }) => {
        if (!isMounted) return;

        setFormData({
          title: data.title,
          content: data.content,
          image: data.image,
          tags: data.tags.join(", "),
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/posts/${id}`, {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      });

      navigate(`/post/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="edit-page">

      {/* LEFT SIDE */}
      <div className="edit-left-side">

        <div
          className="edit-left-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80")',
          }}
        />

        {/* BACK BUTTON */}
        <div className="edit-left-top">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* CONTENT */}
        <div className="edit-left-content">

          <span className="edit-badge">
            Currently Editing
          </span>

          <h1 className="edit-title">
            {formData.title || "Edit Your Post"}
          </h1>

          <p className="edit-subtitle">
            {formData.content || "Update your story and refine your content."}
          </p>

          <div className="edit-meta">
            <span>Blogify</span>
            <span>•</span>
            <span>
              {formData.tags
                ? `${formData.tags.split(",").length} tags`
                : "No tags yet"}
            </span>
          </div>

        </div>

        {/* FOOTER */}
        <div className="edit-footer">
          ©2026 Blogify
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="edit-right-side">

        {/* HEADER */}
        <div className="edit-header">

          <div>
            <h2>Edit Post</h2>
            <p>Update your story and refine your content.</p>
          </div>

          <div className="edit-actions">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="discard-btn"
            >
              Discard
            </button>

            <button
              type="submit"
              form="edit-post-form"
              className="save-btn"
            >
              Save Changes
            </button>

          </div>

        </div>

        {/* FORM */}
        <form
          id="edit-post-form"
          className="edit-form"
          onSubmit={submitHandler}
        >

          {/* IMAGE */}
          {formData.image && (
            <div className="edit-image-wrapper">

              <img
                src={formData.image}
                alt="Preview"
              />

              <div className="edit-image-overlay">
                <button type="button">
                  Change Image
                </button>
              </div>

            </div>
          )}

          {/* IMAGE URL */}
          <div>
            <label>Image URL</label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          {/* TAGS */}
          <div>
            <label>Tags</label>

            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          {/* TITLE */}
          <div>
            <label>Article Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="title-input"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label>Content</label>

            <textarea
              rows="10"
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
          </div>

        </form>

      </div>
    </div>
  );
};

export default EditPost;