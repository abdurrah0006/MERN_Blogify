import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, TriangleAlert } from "lucide-react";

import { errorMessage } from "../api/axios";
import AuthLayout from "../components/AuthLayout";
import PasswordField from "../components/PasswordField";
import { useAuth } from "../context/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Couldn't log you in."));
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      pageTitle="Log in"
      headline="Good to see you again."
      blurb="Pick up where you left off: finish a draft, answer a comment, or read something new."
      title="Log in"
      subtitle="Enter your details to continue."
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      <form className="post-form" onSubmit={submit}>
        {error && <div className="alert" role="alert"><TriangleAlert size={20} /><span>{error}</span></div>}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" autoComplete="email"
            placeholder="you@example.com" value={form.email} onChange={change} required />
        </div>

        <PasswordField name="password" autoComplete="current-password" placeholder="Your password"
          value={form.password} onChange={change} required />

        <button className="btn btn-primary btn-block" disabled={loading}>
          <LogIn size={18} /> {loading ? "Logging in" : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
