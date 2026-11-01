import { LoaderCircle } from "lucide-react";

export default function Loader({ label = "Loading" }) {
  return (
    <div className="loader" role="status">
      <LoaderCircle className="spin" size={32} />
      <span>{label}</span>
    </div>
  );
}

export function PostGridSkeleton({ count = 6 }) {
  return (
    <div className="post-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="post-card skeleton-card">
          <div className="skeleton" style={{ aspectRatio: "16 / 10" }} />
          <div className="post-card-body">
            <div className="skeleton" style={{ height: 14, width: "40%" }} />
            <div className="skeleton" style={{ height: 24, width: "90%" }} />
            <div className="skeleton" style={{ height: 14, width: "100%" }} />
            <div className="skeleton" style={{ height: 14, width: "70%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
