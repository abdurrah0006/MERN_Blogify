import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContextObject";

import API from "../api/axios";

import PostCard from "../components/PostCard";

import "../styles/Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    API.get("/posts/my/posts")
      .then(({ data }) => {
        if (isMounted) {
          setPosts(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="profile-container">

      {/* PROFILE HEADER */}
      <div className="profile-header">

        <div className="profile-header-content">

          <img
            src={user.avatar}
            alt="avatar"
            className="profile-avatar"
          />

          <div>
            <h1 className="profile-username">
              {user.username}
            </h1>

            <p className="profile-email">
              {user.email}
            </p>

            <p className="profile-bio">
              {user.bio || "No bio added yet"}
            </p>
          </div>

        </div>

      </div>

      {/* USER POSTS */}
      <div className="profile-posts-section">

        <h2 className="profile-posts-title">
          My Posts
        </h2>

        {posts.length === 0 ? (
          <p className="profile-empty">No posts yet</p>
        ) : (
          <div className="profile-posts-grid">

            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Profile;
