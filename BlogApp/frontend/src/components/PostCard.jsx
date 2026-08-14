import { Link } from "react-router-dom";

import "../styles/PostCard.css";

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="post-card-image"
        />
      )}

      <div className="post-card-content">
        <div className="post-card-author">
          <img
            src={post.author.avatar}
            alt="avatar"
            className="post-card-avatar"
          />

          <div>
            <p className="post-card-author-name">{post.author.username}</p>
            <p className="post-card-date">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <h2 className="post-card-title">{post.title}</h2>

        <p className="post-card-excerpt">{post.content}</p>

        <div className="post-card-tags">
          {post.tags?.map((tag) => (
            <span key={tag} className="post-card-tag">
              #{tag}
            </span>
          ))}
        </div>

        <Link to={`/post/${post._id}`} className="post-card-link">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
