import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, EyeOff, Pencil, Trash2 } from "lucide-react";

import API, { assetUrl, errorMessage } from "../api/axios";
import Avatar from "../components/Avatar";
import CommentSection from "../components/CommentSection";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";
import useTitle from "../hooks/useTitle";
import { useAuth } from "../context/auth";
import { formatDate } from "../utils/format";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: post, loading, error } = useFetch(`/posts/${id}`);

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useTitle(post?.title);

  if (loading) return <Loader label="Loading story" />;

  if (error || !post) {
    return (
      <div className="container page">
        <EmptyState title="Story not found" text="It may have been deleted, or it's still a draft.">
          <Link to="/" className="btn">
            <ArrowLeft size={18} /> Back to stories
          </Link>
        </EmptyState>
      </div>
    );
  }

  const isAuthor = user?._id === post.author._id;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/posts/${id}`);
      navigate("/profile", { replace: true });
    } catch (err) {
      setDeleteError(errorMessage(err, "Couldn't delete this post."));
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <article className="container page article">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> All stories
      </Link>

      {post.status === "draft" && (
        <div className="alert">
          <EyeOff size={20} />
          <span>This story is a draft. Only you can see it.</span>
        </div>
      )}
      {deleteError && <div className="alert" role="alert">{deleteError}</div>}

      {post.tags?.length > 0 && (
        <div className="tag-list">
          {post.tags.map((tag) => (
            <Link key={tag} to={`/?tag=${encodeURIComponent(tag)}`} className="badge">
              {tag}
            </Link>
          ))}
        </div>
      )}

      <h1 className="article-title">{post.title}</h1>

      <div className="byline-row">
        <Link to={`/profile/${post.author._id}`} className="byline byline-lg">
          <Avatar id={post.author.avatar} name={post.author.username} size={52} />
          <span>
            <strong>{post.author.username}</strong>
            <span className="meta">
              <span><Calendar size={14} /> {formatDate(post.createdAt)}</span>
              <span><Clock size={14} /> {post.readingTime} min read</span>
            </span>
          </span>
        </Link>

        {isAuthor && (
          <div className="row-actions">
            <Link to={`/edit/${post._id}`} className="btn btn-sm">
              <Pencil size={16} /> Edit
            </Link>
            <button className="btn btn-sm" onClick={() => setConfirming(true)}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      {post.image && (
        <figure className="article-cover">
          <img src={assetUrl(post.image)} alt="" />
        </figure>
      )}

      <div className="article-body">
        {post.content.split(/\n{2,}/).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {post.status !== "draft" && <CommentSection postId={post._id} postAuthorId={post.author._id} />}

      {confirming && (
        <ConfirmDialog
          title="Delete this story?"
          message="This also removes its comments and can't be undone."
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </article>
  );
}
