import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const first = Math.max(1, Math.min(page - 2, totalPages - 4));
  const last = Math.min(totalPages, first + 4);
  const numbers = Array.from({ length: last - first + 1 }, (_, i) => first + i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="btn btn-sm" disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={18} />
        Previous
      </button>

      <div className="pagination-pages">
        {numbers.map((n) => (
          <button
            key={n}
            className={`chip chip-square ${n === page ? "active" : ""}`}
            aria-current={n === page ? "page" : undefined}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <button className="btn btn-sm" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Next
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
