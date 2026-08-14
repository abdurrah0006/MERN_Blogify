import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContextObject";

import "../styles/CommentSection.css";

const CommentSection = ({ postId }) => {
  const { user } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    let isMounted = true;

    API.get(`/comments/${postId}`)
      .then(({ data }) => {
        if (isMounted) {
          setComments(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, [postId]);

  // ADD COMMENT
  const addComment = async () => {
    if (!text) return;

    const { data } = await API.post(
      `/comments/${postId}`,
      { text }
    );

    setComments([data, ...comments]);
    setText("");
  };

  // DELETE COMMENT
  const deleteComment = async (id) => {
    await API.delete(`/comments/${id}`);

    setComments(
      comments.filter((c) => c._id !== id)
    );
  };

  return (
    <div className="comment-section">

      {/* ADD COMMENT */}
      {user && (
        <div className="comment-form">

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="comment-input"
            placeholder="Write a comment..."
          />

          <button
            onClick={addComment}
            className="comment-submit-btn"
          >
            Post
          </button>

        </div>
      )}

      {/* COMMENTS LIST */}
      <div className="comment-list">

        {comments.map((c) => (
          <div
            key={c._id}
            className="comment-item"
          >

            <div className="comment-content">

              <img
                src={c.user.avatar}
                className="comment-avatar"
              />

              <div>
                <p className="comment-author">
                  {c.user.username}
                </p>

                <p className="comment-text">{c.text}</p>
              </div>

            </div>

            {user &&
              user._id === c.user._id && (
                <button
                  onClick={() =>
                    deleteComment(c._id)
                  }
                  className="comment-delete-btn"
                >
                  Delete
                </button>
              )}

          </div>
        ))}

      </div>
    </div>
  );
};

export default CommentSection;
