import { Link } from "react-router-dom";
import { Calendar, Clock, Pencil, PenLine, Trash2 } from "lucide-react";

import Avatar from "./Avatar";
import { assetUrl } from "../api/axios";
import { formatDate } from "../utils/format";

// Pass `onDelete` to show Edit / Delete controls (used on the owner's profile).
export default function PostCard({ post, onDelete }) {
  const { author } = post;

  return (
    <article className="post-card">
      <div className="post-card-cover">
        {post.image ? (
          <img src={assetUrl(post.image)} alt="" loading="lazy" />
        ) : (
          <div className="cover-placeholder" aria-hidden="true">
            <PenLine size={36} />
          </div>
        )}
        {post.status === "draft" && <span className="badge badge-solid cover-badge">Draft</span>}
      </div>

      <div className="post-card-body">
        {post.tags?.length > 0 && (
          <div className="tag-list">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="badge">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="post-card-title">
          <Link to={`/post/${post._id}`} className="stretched-link">
            {post.title}
          </Link>
        </h3>

        <p className="post-card-excerpt">{post.content}</p>

        <div className="post-card-footer">
          <Link to={`/profile/${author._id}`} className="byline">
            <Avatar id={author.avatar} name={author.username} size={32} />
            <span>{author.username}</span>
          </Link>

          <div className="meta">
            <span>
              <Calendar size={14} /> {formatDate(post.createdAt)}
            </span>
            <span>
              <Clock size={14} /> {post.readingTime} min
            </span>
          </div>
        </div>
      </div>

      {onDelete && (
        <div className="post-card-actions">
          <Link to={`/edit/${post._id}`} className="btn btn-sm">
            <Pencil size={16} /> Edit
          </Link>
          <button type="button" className="btn btn-sm" onClick={() => onDelete(post)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}
    </article>
  );
}
