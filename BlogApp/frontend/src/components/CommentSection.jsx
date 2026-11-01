import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Send, Trash2 } from "lucide-react";

import API, { errorMessage } from "../api/axios";
import Avatar from "./Avatar";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../context/auth";
import { formatDate } from "../utils/format";

export default function CommentSection({ postId, postAuthorId }) {
  const { user } = useAuth();
  const { data, loading, setData } = useFetch(`/comments/${postId}`);
  const comments = data || [];

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const addComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSending(true);
    setError("");
    try {
      const { data: created } = await API.post(`/comments/${postId}`, { text });
      setData((list) => [created, ...(list || [])]);
      setText("");
    } catch (err) {
      setError(errorMessage(err, "Couldn't post your comment."));
    } finally {
      setSending(false);
    }
  };

  const removeComment = async (id) => {
    try {
      await API.delete(`/comments/${id}`);
      setData((list) => list.filter((c) => c._id !== id));
    } catch (err) {
      setError(errorMessage(err, "Couldn't delete that comment."));
    }
  };

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title">
        <MessageCircle size={26} /> Comments ({comments.length})
      </h2>

      {user ? (
        <form className="comment-form" onSubmit={addComment}>
          <Avatar id={user.avatar} name={user.username} size={44} />
          <div className="comment-form-main">
            <label htmlFor="comment-text" className="visually-hidden">
              Write a comment
            </label>
            <textarea
              id="comment-text"
              className="textarea"
              rows={3}
              maxLength={1000}
              placeholder="Share your thoughts"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {error && <p className="field-error">{error}</p>}
            <button className="btn btn-primary btn-sm" disabled={sending || !text.trim()}>
              <Send size={16} /> {sending ? "Posting" : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="comments-login">
          <Link to="/login">Log in</Link> or <Link to="/register">create an account</Link> to join
          the conversation.
        </p>
      )}

      {loading && !data && <p className="hint">Loading comments</p>}
      {!loading && comments.length === 0 && <p className="hint">No comments yet. Be the first.</p>}

      <ul className="comment-list">
        {comments.map((c) => {
          const canDelete = user && (user._id === c.user._id || user._id === postAuthorId);
          return (
            <li key={c._id} className="comment">
              <Avatar id={c.user.avatar} name={c.user.username} size={44} />
              <div className="comment-main">
                <div className="comment-head">
                  <Link to={`/profile/${c.user._id}`} className="comment-author">
                    {c.user.username}
                  </Link>
                  <span className="hint">{formatDate(c.createdAt)}</span>
                </div>
                <p>{c.text}</p>
              </div>
              {canDelete && (
                <button
                  type="button"
                  className="btn btn-icon btn-ghost"
                  aria-label="Delete comment"
                  onClick={() => removeComment(c._id)}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
