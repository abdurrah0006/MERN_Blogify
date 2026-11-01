import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PenLine } from "lucide-react";

import API, { errorMessage } from "../api/axios";
import PostForm from "../components/PostForm";
import useTitle from "../hooks/useTitle";

export default function CreatePost() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useTitle("Write a story");

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError("");
    try {
      const { data: post } = await API.post("/posts", formData);
      navigate(post.status === "draft" ? "/profile" : `/post/${post._id}`);
    } catch (err) {
      setError(errorMessage(err, "Couldn't save your story."));
      setSubmitting(false);
    }
  };

  return (
    <div className="container page narrow">
      <div className="page-head">
        <h1><PenLine size={32} /> Write a story</h1>
        <p>Publish now, or save a draft and come back to it.</p>
      </div>
      <div className="card form-card">
        <PostForm onSubmit={handleSubmit} submitting={submitting} error={error} />
      </div>
    </div>
  );
}
