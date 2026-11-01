import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Save, TriangleAlert } from "lucide-react";

import API, { errorMessage } from "../api/axios";
import Avatar from "../components/Avatar";
import { DOODLE_IDS, resolveDoodle } from "../data/doodles";
import useTitle from "../hooks/useTitle";
import { useAuth } from "../context/auth";

export default function EditProfile() {
  const { user, updateUser } = useAuth();

  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(resolveDoodle(user.avatar, user.username));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useTitle("Edit profile");

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const { data } = await API.put("/users/me", { username, bio, avatar });
      updateUser(data);
      setSaved(true);
    } catch (err) {
      setError(errorMessage(err, "Couldn't save your profile."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container page narrow">
      <Link to="/profile" className="back-link">
        <ArrowLeft size={18} /> Your profile
      </Link>
      <div className="page-head">
        <h1>Edit profile</h1>
        <p>Choose a doodle and tell people a little about you.</p>
      </div>

      <form className="card form-card post-form" onSubmit={submit}>
        {error && (
          <div className="alert" role="alert"><TriangleAlert size={20} /><span>{error}</span></div>
        )}
        {saved && (
          <div className="alert alert-success" role="status"><Check size={20} /><span>Profile saved.</span></div>
        )}

        <div className="field">
          <span className="label">Avatar</span>
          <div className="avatar-picker" role="radiogroup" aria-label="Choose a doodle avatar">
            {DOODLE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={avatar === id}
                aria-label={id}
                className="avatar-option"
                onClick={() => setAvatar(id)}
              >
                <Avatar id={id} size={56} />
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" className="input" value={username} minLength={2} maxLength={30}
            onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" className="input" value={user.email} disabled />
          <span className="hint">Your email can't be changed.</span>
        </div>

        <div className="field">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" className="textarea" rows={4} maxLength={200} value={bio}
            placeholder="A line or two about you" onChange={(e) => setBio(e.target.value)} />
          <span className="hint align-end">{bio.length}/200</span>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" disabled={saving}>
            <Save size={18} /> {saving ? "Saving" : "Save changes"}
          </button>
          <Link to="/profile" className="btn">Done</Link>
        </div>
      </form>
    </div>
  );
}
