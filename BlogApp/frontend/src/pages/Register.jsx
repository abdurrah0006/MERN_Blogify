import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TriangleAlert, UserPlus } from "lucide-react";

import { errorMessage } from "../api/axios";
import AuthLayout from "../components/AuthLayout";
import Avatar from "../components/Avatar";
import PasswordField from "../components/PasswordField";
import { DOODLE_IDS } from "../data/doodles";
import { useAuth } from "../context/auth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "", avatar: DOODLE_IDS[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Couldn't create your account."));
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      pageTitle="Create account"
      headline="Your ideas deserve a page."
      blurb="Join Blogify to publish stories, save drafts and talk with other writers."
      title="Create your account"
      subtitle="It takes less than a minute."
      footer={<>Already have an account? <Link to="/login">Log in</Link></>}
    >
      <form className="post-form" onSubmit={submit}>
        {error && <div className="alert" role="alert"><TriangleAlert size={20} /><span>{error}</span></div>}

        <div className="field">
          <span className="label">Pick your doodle</span>
          <div className="avatar-picker avatar-picker-sm" role="radiogroup" aria-label="Choose a doodle avatar">
            {DOODLE_IDS.map((id) => (
              <button key={id} type="button" role="radio" aria-checked={form.avatar === id} aria-label={id}
                className="avatar-option" onClick={() => setForm({ ...form, avatar: id })}>
                <Avatar id={id} size={44} />
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" className="input" autoComplete="username" minLength={2}
            maxLength={30} placeholder="How you'll appear to others" value={form.username} onChange={change} required />
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" autoComplete="email"
            placeholder="you@example.com" value={form.email} onChange={change} required />
        </div>

        <PasswordField name="password" autoComplete="new-password" minLength={6}
          placeholder="At least 6 characters" value={form.password} onChange={change} required />

        <button className="btn btn-primary btn-block" disabled={loading}>
          <UserPlus size={18} /> {loading ? "Creating account" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
