import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import API from "../api/axios";
import CommentSection from "../components/CommentSection";
import { AuthContext } from "../context/AuthContextObject";

import "../styles/PostDetails.css";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    API.get(`/posts/${id}`)
      .then(({ data }) => {
        if (isMounted) setPost(data);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/posts/${id}`);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="post-loading">Loading...</div>;
  }

  if (!post) {
    return <div className="post-not-found">Post not found</div>;
  }

  return (
    <div className="post-page">

      {/* HERO IMAGE */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="post-hero-image"
        />
      )}

      {/* AUTHOR BAR */}
      <div className="post-author-bar">

        <div className="post-author-info">

          <img
            src={post.author.avatar}
            alt="avatar"
            className="post-author-avatar"
          />

          <div>
            <h3 className="post-author-name">
              {post.author.username}
            </h3>

            <p className="post-date">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>

          </div>

        </div>

        {user && user._id === post.author._id && (
          <div className="post-actions">

            <Link
              to={`/edit/${post._id}`}
              className="post-edit-btn"
            >
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="post-delete-btn"
            >
              Delete
            </button>

          </div>
        )}

      </div>

      {/* TAGS */}
      {post.tags?.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="post-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* TITLE */}
      <h1 className="post-title">
        {post.title}
      </h1>

      {/* CONTENT */}
      <div className="post-content">
        {post.content}
      </div>

      {/* COMMENTS */}
      <CommentSection postId={post._id} />

    </div>
  );
};

export default PostDetails;