import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { login } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { logIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ProtectedRoute puts the page the user wanted into location.state
  const from = location.state?.from;
  const redirectTo = from ? from.pathname + from.search : "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(username, password);
      logIn(user);
      // replace, so the back button does not return to the login page
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <section className="login">
      <h1>Login</h1>
      {from && <p>Please sign in to see this page.</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default Login;
