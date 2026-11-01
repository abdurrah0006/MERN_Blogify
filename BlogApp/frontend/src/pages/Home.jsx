import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, PenLine, X } from "lucide-react";

import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import Doodle from "../components/Doodle";
import { PostGridSkeleton } from "../components/Loader";
import useFetch from "../hooks/useFetch";
import useTitle from "../hooks/useTitle";
import { useAuth } from "../context/auth";

function Hero() {
  const { user } = useAuth();

  return (
    <section className="hero">
      <div>
        <h1>Write it down. Put it out there.</h1>
        <p>
          Blogify is a home for short essays, field notes and half-formed ideas. Read what other
          people are thinking about, or publish your own in a few minutes.
        </p>
        <div className="hero-actions">
          <Link to={user ? "/create" : "/register"} className="btn btn-primary">
            <PenLine size={18} /> Start writing
          </Link>
          <a href="#stories" className="btn">
            <BookOpen size={18} /> Browse stories
          </a>
        </div>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="tile tile-1"><Doodle id="cat" /></div>
        <div className="tile tile-2"><Doodle id="owl" /></div>
        <div className="tile tile-3"><Doodle id="mushroom" /></div>
      </div>
    </section>
  );
}

export default function Home() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const tag = params.get("tag") || "";
  const page = Number(params.get("page")) || 1;
  const filtering = Boolean(q || tag);

  useTitle(q ? `Search: ${q}` : tag ? `#${tag}` : "");

  const query = new URLSearchParams({ page, limit: 9 });
  if (q) query.set("search", q);
  if (tag) query.set("tag", tag);

  const posts = useFetch(`/posts?${query}`);
  const tags = useFetch("/posts/tags");

  const update = (changes) =>
    setParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
      return next;
    });

  const list = posts.data?.posts;

  return (
    <div className="container">
      {!filtering && page === 1 && <Hero />}

      <section id="stories" className="page">
        <div className="section-head">
          <h2>
            {q ? `Results for “${q}”` : tag ? `Stories tagged ${tag}` : "Latest stories"}
          </h2>
          {filtering && (
            <button className="btn btn-sm" onClick={() => setParams({})}>
              <X size={16} /> Clear filters
            </button>
          )}
        </div>

        {tags.data?.length > 0 && (
          <div className="chips" role="group" aria-label="Filter by tag">
            <button className={`chip ${!tag ? "active" : ""}`} onClick={() => update({ tag: "", page: "" })}>
              All
            </button>
            {tags.data.map(({ name }) => (
              <button
                key={name}
                className={`chip ${tag.toLowerCase() === name ? "active" : ""}`}
                onClick={() => update({ tag: name, page: "" })}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {posts.error ? (
          <EmptyState title="Couldn't load stories" text="Check that the backend is running, then try again.">
            <button className="btn" onClick={posts.reload}>Try again</button>
          </EmptyState>
        ) : !list ? (
          <PostGridSkeleton />
        ) : list.length === 0 ? (
          <EmptyState
            doodle="cloud"
            title={filtering ? "No stories match that" : "No stories yet"}
            text={filtering ? "Try a different search or tag." : "Be the first to publish something."}
          >
            <Link to="/create" className="btn btn-primary">
              <PenLine size={18} /> Write a story
            </Link>
          </EmptyState>
        ) : (
          <>
            <div className={`post-grid ${posts.loading ? "is-loading" : ""}`}>
              {list.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Pagination
              page={posts.data.currentPage}
              totalPages={posts.data.totalPages}
              onChange={(n) => {
                update({ page: n > 1 ? String(n) : "" });
                document.getElementById("stories")?.scrollIntoView();
              }}
            />
          </>
        )}
      </section>
    </div>
  );
}
