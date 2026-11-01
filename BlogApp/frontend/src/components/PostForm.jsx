import { useEffect, useRef, useState } from "react";
import { TriangleAlert, Clock, ImagePlus, Save, Send, X } from "lucide-react";

import { assetUrl } from "../api/axios";
import useFetch from "../hooks/useFetch";
import { countWords, readingTime } from "../utils/format";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_TAGS = 5;

// Shared by the Create and Edit pages.
// `onSubmit(formData)` receives multipart data ready to send to the API.
export default function PostForm({ initial, onSubmit, submitting, error }) {
  const isPublished = initial?.status === "published";
  const fileInput = useRef(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") ?? "");
  const [existingImage, setExistingImage] = useState(initial?.image ?? "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [problem, setProblem] = useState("");

  const { data: popularTags } = useFetch("/posts/tags");

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
  const cover = preview || assetUrl(existingImage);

  const pickImage = (e) => {
    const picked = e.target.files[0];
    if (!picked) return;

    if (!picked.type.startsWith("image/")) return setProblem("Choose an image file (JPG, PNG, WEBP or GIF).");
    if (picked.size > MAX_IMAGE_BYTES) return setProblem("Image must be 5 MB or smaller.");

    setProblem("");
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const removeImage = () => {
    setFile(null);
    setPreview("");
    setExistingImage("");
    if (fileInput.current) fileInput.current.value = "";
  };

  const toggleTag = (name) => {
    const has = tagList.some((t) => t.toLowerCase() === name);
    const next = has
      ? tagList.filter((t) => t.toLowerCase() !== name)
      : tagList.length < MAX_TAGS
        ? [...tagList, name]
        : tagList;
    setTags(next.join(", "));
  };

  const submit = (status) => {
    if (!title.trim() || !content.trim()) {
      setProblem("Add a title and some content before saving.");
      return;
    }
    setProblem("");

    const data = new FormData();
    data.append("title", title.trim());
    data.append("content", content);
    data.append("tags", tags);
    data.append("status", status);
    if (file) data.append("image", file);
    else if (initial?.image && !existingImage) data.append("removeImage", "true");

    onSubmit(data);
  };

  const message = problem || error;

  return (
    <form
      className="post-form"
      onSubmit={(e) => {
        e.preventDefault();
        submit("published");
      }}
    >
      {message && (
        <div className="alert" role="alert">
          <TriangleAlert size={20} />
          <span>{message}</span>
        </div>
      )}

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className="input input-title"
          placeholder="Give your story a title"
          maxLength={150}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <span className="hint align-end">{title.length}/150</span>
      </div>

      <div className="field">
        <span className="label">Cover image</span>
        {cover ? (
          <div className="cover-preview">
            <img src={cover} alt="Cover preview" />
            <button type="button" className="btn btn-sm" onClick={removeImage}>
              <X size={16} /> Remove
            </button>
          </div>
        ) : (
          <label className="upload">
            <ImagePlus size={32} />
            <strong>Add a cover image</strong>
            <span className="hint">JPG, PNG, WEBP or GIF, up to 5 MB</span>
            <input ref={fileInput} type="file" accept="image/*" className="visually-hidden" onChange={pickImage} />
          </label>
        )}
      </div>

      <div className="field">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          className="input"
          placeholder="travel, food, notes"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <span className="hint">Separate with commas. Up to {MAX_TAGS} tags.</span>

        {popularTags?.length > 0 && (
          <div className="chips" aria-label="Popular tags">
            {popularTags.map(({ name }) => (
              <button
                key={name}
                type="button"
                className={`chip chip-sm ${tagList.some((t) => t.toLowerCase() === name) ? "active" : ""}`}
                onClick={() => toggleTag(name)}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="content">Story</label>
        <textarea
          id="content"
          className="textarea textarea-story"
          rows={14}
          placeholder="Start writing. Leave a blank line between paragraphs."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <span className="hint align-end">
          {countWords(content)} words, <Clock size={13} className="inline-icon" />
          {content.trim() ? ` ${readingTime(content)} min read` : " 0 min read"}
        </span>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          <Send size={18} />
          {submitting ? "Saving" : isPublished ? "Update post" : "Publish"}
        </button>
        <button type="button" className="btn" disabled={submitting} onClick={() => submit("draft")}>
          <Save size={18} />
          {isPublished ? "Move to drafts" : "Save draft"}
        </button>
      </div>
    </form>
  );
}
