import { useEffect, useState } from "react";

import API from "../api/axios";

import "../styles/HeroCarousel.css";

const fallbackImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";

export default function TravelCarouselHero() {
  const [posts, setPosts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    API.get("/posts?page=1&limit=5")
      .then(({ data }) => {
        if (isMounted) {
          setPosts(data.posts);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div className="hero-carousel-loading">
        <div className="hero-carousel-loading-container">
          <h1 className="hero-carousel-loading-text">
            Initializing backend...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-carousel">
      <div className="hero-carousel-container">
        {posts.map((post, index) => (
          <div
            key={post._id}
            className={`hero-carousel-slide ${
              activeIndex === index ? "active" : ""
            }`}
          >
            <img
              src={post.image || fallbackImage}
              alt={post.title}
              className="hero-carousel-image"
            />

            <div className="hero-carousel-overlay-1" />
            <div className="hero-carousel-overlay-2" />

            <div className="hero-carousel-content">
              <div className="hero-carousel-tag">
                {post.tags?.[0] || "Blog"}
              </div>

              <h1 className="hero-carousel-title">{post.title}</h1>

              <p className="hero-carousel-excerpt">
                {post.content?.slice(0, 120)}...
              </p>
            </div>

            <div className="hero-carousel-author">
              <img
                src={post.author?.avatar}
                alt={post.author?.username}
                className="hero-carousel-avatar"
              />

              <div>
                <h3 className="hero-carousel-author-name">
                  {post.author?.username}
                </h3>

                <div className="hero-carousel-meta">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>-</span>
                  <span>5 mins read</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="hero-carousel-dots">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`hero-carousel-dot ${
                activeIndex === index ? "active" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
