import { useContext, useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { Search } from "lucide-react";

import { AuthContext } from "../context/AuthContextObject";

import "../styles/Header.css";

export default function Header({
  search,
  setSearch,
}) {
  const { user, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const location = useLocation();

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const isHome =
    location.pathname === "/";

  return (
    <header
      className={`header ${
        isHome
          ? scrolled
            ? "home-header-scrolled"
            : "home-header-normal"
          : "page-header"
      }`}
    >
      <div className="header-container">

        <Link
          to="/"
          className="header-logo"
        >
          <div className="header-logo-badge">
            B
          </div>
          <span
            className={`header-logo-text ${
              scrolled || !isHome
                ? "scrolled"
                : "normal"
            }`}
          >
            Blogify
          </span>
        </Link>

        <div className="header-search-wrapper">
          <div
            className={`header-search ${
              scrolled || !isHome
                ? "scrolled"
                : "normal"
            }`}
          >
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              size={22}
              className={`header-search-icon ${
                scrolled || !isHome
                  ? "scrolled"
                  : "normal"
              }`}
            />
          </div>
        </div>

        <div className="header-actions">
          <Link
            to={user ? "/create" : "/login"}
            className={`header-create-btn ${
              scrolled || !isHome
                ? "scrolled"
                : "normal"
            }`}
          >
            Create Post
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className={`header-profile-link ${
                  scrolled || !isHome
                    ? "scrolled"
                    : "normal"
                }`}
              >
                {user.username}
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className={`header-logout-btn ${
                  scrolled || !isHome
                    ? "scrolled"
                    : "normal"
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`header-login-link ${
                  scrolled || !isHome
                    ? "scrolled"
                    : "normal"
                }`}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="header-signup-btn"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
