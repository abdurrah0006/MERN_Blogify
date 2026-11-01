import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import API, { errorMessage } from "../api/axios";
import PostForm from "../components/PostForm";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";
import useTitle from "../hooks/useTitle";
import { useAuth } from "../context/auth";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: post, loading, error: loadError } = useFetch(`/posts/${id}`);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useTitle("Edit story");

  if (loading) return <Loader label="Loading story" />;

  if (loadError || !post || post.author._id !== user._id) {
    return (
      <div className="container page">
        <EmptyState title="You can't edit this story" text="It doesn't exist, or it belongs to someone else.">
          <Link to="/profile" className="btn">
            <ArrowLeft size={18} /> Back to your profile
          </Link>
        </EmptyState>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError("");
    try {
      const { data: saved } = await API.put(`/posts/${id}`, formData);
      navigate(saved.status === "draft" ? "/profile" : `/post/${id}`);
    } catch (err) {
      setError(errorMessage(err, "Couldn't save your changes."));
      setSubmitting(false);
    }
  };

  return (
    <div className="container page narrow">
      <button type="button" className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>
      <div className="page-head">
        <h1><Pencil size={32} /> Edit story</h1>
      </div>
      <div className="card form-card">
        <PostForm key={post._id} initial={post} onSubmit={handleSubmit} submitting={submitting} error={error} />
      </div>
    </div>
  );
}
