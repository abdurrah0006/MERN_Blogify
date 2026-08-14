import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/axios";
import { AuthContext } from "../context/AuthContextObject";

import "../styles/RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const avatars = [
    "https://i.pravatar.cc/150?img=68",
    "https://i.pravatar.cc/150?img=52",
    "https://i.pravatar.cc/150?img=29",
    "https://i.pravatar.cc/150?img=33",
    "https://i.pravatar.cc/150?img=47",
    "https://i.pravatar.cc/150?img=16",
  ];

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: avatars[0],
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

      const { data } = await API.post("/auth/register", formData);

      login(data);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Registration failed");
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
              'url("https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80")',
          }}
        />

        <div className="logo">
          <div className="logo-box">B</div>
          <span>Blogify</span>
        </div>

        <div className="hero-text">
          <h1>Explore.</h1>

          <p>
            Join our community of modern explorers and start your journey today.
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
              <h2>Create account</h2>
              <p>Start your blogging journey today.</p>
            </div>

            {/* FORM */}
            <form onSubmit={submitHandler} className="form">

              {/* FULL NAME */}
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  name="username"
                  placeholder="John Doe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

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

              {/* AVATARS */}
              <div>
                <label>Choose Avatar</label>

                <div className="avatar-grid">
                  {avatars.map((avatar) => (
                    <img
                      key={avatar}
                      src={avatar}
                      alt="avatar"
                      onClick={() =>
                        setFormData({ ...formData, avatar })
                      }
                      className={`avatar ${
                        formData.avatar === avatar ? "selected" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* BUTTON */}
              <button type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "Get Started"}
              </button>
            </form>

            {/* FOOTER */}
            <p className="bottom-text">
              Already have an account?{" "}
              <Link to="/login">Log in</Link>
            </p>

          </div>
        </div>
      </div>

    </div>
  );
}