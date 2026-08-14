import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/axios";
import { AuthContext } from "../context/AuthContextObject";

import "../styles/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", formData);

      login(data);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="left-side">
        <div
          className="left-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80")',
          }}
        />

        <div className="logo">
          <div className="logo-box">B</div>
          <span>Blogify</span>
        </div>

        <div className="hero-text">
          <h1>Blog</h1>

          <p>
            Here, we share travel tips, destination guides, and stories that
            inspire your next adventure.
          </p>
        </div>

        <div className="footer-text">
          ©2026 Blogify. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-side">
        <div className="form-wrapper">
          <div className="form-card">

            {/* HEADER */}
            <div className="heading">
              <h2>Welcome back</h2>
              <p>Please enter your details to sign in.</p>
            </div>

            {/* FORM */}
            <form onSubmit={submitHandler} className="form">

              {/* EMAIL */}
              <div>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                  <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button type="submit" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* FOOTER */}
            <p className="bottom-text">
              Don&apos;t have an account?{" "}
              <Link to="/register">Sign up</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}