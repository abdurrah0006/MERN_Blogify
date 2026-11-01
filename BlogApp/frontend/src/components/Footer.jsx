import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/auth";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="footer-blurb">
            A home for short essays, field notes and half-formed ideas. Read something, write
            something.
          </p>
        </div>

        <nav aria-label="Explore">
          <h3>Explore</h3>
          <Link to="/">All stories</Link>
          <Link to="/create">Write a story</Link>
        </nav>

        <nav aria-label="Account">
          <h3>Account</h3>
          {user ? (
            <>
              <Link to="/profile">Your profile</Link>
              <Link to="/settings">Edit profile</Link>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Create an account</Link>
            </>
          )}
        </nav>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Blogify. All rights reserved.</span>
      </div>
    </footer>
  );
}
