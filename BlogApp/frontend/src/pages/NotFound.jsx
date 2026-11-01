import { Link } from "react-router-dom";
import { House } from "lucide-react";
import EmptyState from "../components/EmptyState";
import useTitle from "../hooks/useTitle";

export default function NotFound() {
  useTitle("Page not found");
  return (
    <div className="container page">
      <EmptyState title="This page doesn't exist" text="The link may be broken, or the page was removed.">
        <Link to="/" className="btn btn-primary"><House size={18} /> Go home</Link>
      </EmptyState>
    </div>
  );
}
