import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, FileText, PenLine, Settings } from "lucide-react";

import API, { errorMessage } from "../api/axios";
import Avatar from "../components/Avatar";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Loader, { PostGridSkeleton } from "../components/Loader";
import PostCard from "../components/PostCard";
import useFetch from "../hooks/useFetch";
import useTitle from "../hooks/useTitle";
import { useAuth } from "../context/auth";
import { formatDate } from "../utils/format";

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const isOwner = !id || id === user?._id;

  // Own profile uses /posts/mine (includes drafts); other people's uses the public endpoints.
  const mine = useFetch(isOwner ? "/posts/mine" : null);
  const person = useFetch(isOwner ? null : `/users/${id}`);
  const theirs = useFetch(isOwner ? null : `/posts?author=${id}&limit=24`);

  const [tab, setTab] = useState("published");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const profile = isOwner ? user : person.data;
  useTitle(profile?.username);

  if (!isOwner && person.loading) return <Loader label="Loading profile" />;
  if (!profile) {
    return (
      <div className="container page">
        <EmptyState title="Profile not found" text="That user doesn't exist.">
          <Link to="/" className="btn">Back to stories</Link>
        </EmptyState>
      </div>
    );
  }

  const posts = isOwner ? mine.data : theirs.data?.posts;
  const loading = isOwner ? mine.loading : theirs.loading;
  const published = posts?.filter((p) => p.status !== "draft") ?? [];
  const drafts = posts?.filter((p) => p.status === "draft") ?? [];
  const visible = isOwner && tab === "drafts" ? drafts : published;

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/posts/${toDelete._id}`);
      mine.setData((list) => list.filter((p) => p._id !== toDelete._id));
      setToDelete(null);
    } catch (err) {
      setError(errorMessage(err, "Couldn't delete that story."));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container page">
      <section className="profile-head">
        <Avatar id={profile.avatar} name={profile.username} size={128} />

        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p className={profile.bio ? "profile-bio" : "profile-bio hint"}>
            {profile.bio || (isOwner ? "You haven't added a bio yet." : "No bio yet.")}
          </p>
          <div className="meta meta-lg">
            <span><Calendar size={16} /> Joined {formatDate(profile.createdAt)}</span>
            <span><FileText size={16} /> {published.length} {published.length === 1 ? "story" : "stories"}</span>
          </div>
        </div>

        {isOwner && (
          <div className="row-actions">
            <Link to="/settings" className="btn">
              <Settings size={18} /> Edit profile
            </Link>
            <Link to="/create" className="btn btn-primary">
              <PenLine size={18} /> New story
            </Link>
          </div>
        )}
      </section>

      <section className="profile-posts">
        {isOwner ? (
          <div className="chips" role="tablist" aria-label="Your stories">
            <button role="tab" aria-selected={tab === "published"} className={`chip ${tab === "published" ? "active" : ""}`} onClick={() => setTab("published")}>
              Published ({published.length})
            </button>
            <button role="tab" aria-selected={tab === "drafts"} className={`chip ${tab === "drafts" ? "active" : ""}`} onClick={() => setTab("drafts")}>
              Drafts ({drafts.length})
            </button>
          </div>
        ) : (
          <h2>Stories by {profile.username}</h2>
        )}

        {error && <div className="alert" role="alert">{error}</div>}

        {!posts && loading ? (
          <PostGridSkeleton count={3} />
        ) : visible.length === 0 ? (
          <EmptyState
            doodle={tab === "drafts" ? "robot" : "ghost"}
            title={tab === "drafts" && isOwner ? "No drafts" : "No stories yet"}
            text={isOwner ? "Anything you write will show up here." : "Check back later."}
          >
            {isOwner && (
              <Link to="/create" className="btn btn-primary">
                <PenLine size={18} /> Write a story
              </Link>
            )}
          </EmptyState>
        ) : (
          <div className="post-grid">
            {visible.map((post) => (
              <PostCard key={post._id} post={post} onDelete={isOwner ? setToDelete : undefined} />
            ))}
          </div>
        )}
      </section>

      {toDelete && (
        <ConfirmDialog
          title="Delete this story?"
          message={`“${toDelete.title}” and its comments will be removed for good.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
