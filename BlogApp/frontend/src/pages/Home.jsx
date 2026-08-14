import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";
import TravelCarouselHero from "../components/HeroCarousel";

import "../styles/Home.css";

export default function Home({ search }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;
    let url = `/posts?page=${page}&limit=9`;

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (selectedCategory !== "All") {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }

    API.get(url)
      .then(({ data }) => {
        if (!isMounted) return;

        setPosts(data.posts);
        setTotalPages(data.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, [page, search, selectedCategory]);

  return (
    <>
      <TravelCarouselHero />

      <div className="home-section">
        <div className="home-container">
          <h1 className="home-title">Blog</h1>

          <p className="home-subtitle">
            Here, we share travel tips, destination guides, and stories that
            inspire your next adventure.
          </p>

          <div className="home-posts-grid">
            {posts.map((post) => (
              <Link
                to={`/post/${post._id}`}
                key={post._id}
                className="home-post-card"
              >
                <div className="home-post-image-wrapper">
                  <img
                    src={
                      post.image ||
                      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={post.title}
                    className="home-post-image"
                  />

                  <span className="home-post-tag">
                    {post.tags?.[0] || "Blog"}
                  </span>
                </div>

                <div className="home-post-meta">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>-</span>
                  <span>5 mins read</span>
                </div>

                <h2 className="home-post-title">{post.title}</h2>

                <p className="home-post-excerpt">{post.content}</p>

                <div className="home-post-author">
                  <img
                    src={post.author?.avatar}
                    alt={post.author?.username}
                    className="home-post-avatar"
                  />

                  <span className="home-post-author-name">
                    {post.author?.username}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="home-empty-state">
              <h2 className="home-empty-title">No blogs found</h2>
              <p className="home-empty-text">Try searching another topic.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="home-pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="home-pagination-btn home-pagination-prev"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`home-pagination-btn ${
                      page === num ? "active" : ""
                    }`}
                  >
                    {num}
                  </button>
                )
              )}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="home-pagination-btn home-pagination-next"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
