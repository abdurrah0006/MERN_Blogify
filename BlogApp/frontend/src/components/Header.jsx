import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown, LogOut, PenLine, Search, Settings, User } from "lucide-react";

import Logo from "./Logo";
import Avatar from "./Avatar";
import { useAuth } from "../context/auth";

// Keyed by the current query so the input resets when the URL changes.
function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const onSubmit = (e) => {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("q").trim();
    navigate(value ? `/?q=${encodeURIComponent(value)}` : "/");
  };

  return (
    <form key={q} role="search" className="search" onSubmit={onSubmit}>
      <Search size={20} className="search-icon" aria-hidden="true" />
      <input
        name="q"
        type="search"
        className="input"
        placeholder="Search stories"
        aria-label="Search stories"
        defaultValue={q}
      />
    </form>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="menu" ref={ref}>
      <button
        type="button"
        className="menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
      >
        <Avatar id={user.avatar} name={user.username} size={36} />
        <ChevronDown size={18} className="hide-sm" />
      </button>

      {open && (
        <div className="menu-panel" role="menu">
          <p className="menu-name">{user.username}</p>
          <Link to="/profile" role="menuitem" className="menu-item" onClick={() => setOpen(false)}>
            <User size={18} /> Your profile
          </Link>
          <Link to="/settings" role="menuitem" className="menu-item" onClick={() => setOpen(false)}>
            <Settings size={18} /> Edit profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className="menu-item"
            onClick={() => {
              setOpen(false);
              logout();
              navigate("/");
            }}
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="container header-inner">
        <Logo />
        <SearchBar />

        <div className="header-actions">
          <Link to="/create" className="btn btn-primary">
            <PenLine size={18} />
            <span className="hide-sm">Write</span>
          </Link>

          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/login" className="btn">
                Log in
              </Link>
              <Link to="/register" className="btn hide-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
