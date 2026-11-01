import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";

export default function Logo({ inverse = false }) {
  return (
    <Link to="/" className={`logo ${inverse ? "logo-inverse" : ""}`} aria-label="Blogify home">
      <span className="logo-mark">
        <PenLine size={20} strokeWidth={2.5} />
      </span>
      <span className="logo-text">Blogify</span>
    </Link>
  );
}
