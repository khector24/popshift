import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "../../services/adminAuthApi.js";

import "../../styles/pages/admin/AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await loginAdmin(email, password);

      navigate("/admin/articles");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__heading">
          <span>RegionLore Admin</span>
          <h1>Sign in</h1>
          <p>Manage RegionLore articles and publishing.</p>
        </div>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="admin-login__error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
