import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://lost-found-uapb.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.errors || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .login-wrapper * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .login-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(37, 99, 235, 0.12);
          padding: 48px 44px;
          border: 1px solid #e0eaff;
        }
        .brand-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(37,99,235,0.3);
        }
        .login-title { color: #0f172a; font-weight: 700; font-size: 1.6rem; }
        .login-subtitle { color: #64748b; font-size: 0.9rem; }
        .form-label {
          font-weight: 600;
          font-size: 0.82rem;
          color: #374151;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .login-input {
          border: 1.5px solid #dbeafe !important;
          border-left: none !important;
          border-radius: 0 10px 10px 0 !important;
          padding: 12px 16px !important;
          font-size: 0.95rem !important;
          color: #1e293b !important;
          background: #f8faff !important;
          transition: all 0.2s !important;
        }
        .login-input:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.12) !important;
          background: #fff !important;
        }
        .login-icon-box {
          background: #f0f4ff;
          border: 1.5px solid #dbeafe;
          border-right: none;
          border-radius: 10px 0 0 10px;
          color: #2563eb;
          padding: 0 14px;
          display: flex; align-items: center;
        }
        .btn-login {
          background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
          border: none !important;
          border-radius: 10px !important;
          padding: 13px !important;
          font-weight: 600 !important;
          font-size: 0.97rem !important;
          letter-spacing: 0.02em !important;
          box-shadow: 0 4px 14px rgba(37,99,235,0.3) !important;
          transition: all 0.2s !important;
        }
        .btn-login:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37,99,235,0.38) !important;
        }
        .forgot-link { color: #2563eb; font-size: 0.83rem; font-weight: 500; text-decoration: none; }
        .forgot-link:hover { color: #1d4ed8; text-decoration: underline; }
        .login-divider { border-color: #e0eaff; }
        .signup-text { color: #64748b; font-size: 0.88rem; }
        .signup-text a { color: #2563eb; font-weight: 600; text-decoration: none; }
        .login-error {
          border-radius: 10px;
          border: 1.5px solid #fecaca;
          background: #fff5f5;
          color: #dc2626;
          font-size: 0.88rem;
          padding: 10px 14px;
        }
      `}</style>

      <div
        className="login-wrapper d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", background: "#f0f4ff" }}
      >
        <div className="login-card w-100" style={{ maxWidth: "420px" }}>
          {/* Brand Icon */}
          <div className="d-flex justify-content-center mb-3">
            <div className="brand-icon">
              <svg width="26" height="26" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          <h2 className="login-title text-center mb-1">Welcome back</h2>
          <p className="login-subtitle text-center mb-4">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label d-block">Email Address</label>
              <div className="d-flex">
                <span className="login-icon-box">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control login-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="form-label d-block">Password</label>
              <div className="d-flex">
                <span className="login-icon-box">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control login-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="d-flex justify-content-end mb-4">
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary btn-login w-100 mb-3">
              Sign In
            </button>
          </form>

          {/* Error */}
          {error && <div className="login-error mt-2">{error}</div>}

          <hr className="login-divider" />
          <p className="signup-text text-center mb-0">
            Don't have an account? <a href="#">Create one free</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;