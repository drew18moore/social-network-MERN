import React, { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import LoadingAnimation from "../../components/loading/LoadingAnimation";

export default function Login() {
  const usernameRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  async function login(e: any) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await api.post(
        "/api/auth/login",
        {
          username: usernameRef.current?.value.trim().toLowerCase(),
          password: passwordRef.current?.value,
        },
        {
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      setCurrentUser(response.data);
      setIsLoading(false);
      navigate(from, { replace: true });
    } catch (err: any) {
      setIsLoading(false);
      console.error(err);
      setError(err.response.data.message);
    }
  }

  return (
    <>
      <div className="auth-container">
        <form onSubmit={login} className="auth-form">
          <h2 className="auth-heading">Log In</h2>
          {error ? <p className="error-message">{error}</p> : ""}
          <input
            ref={usernameRef}
            type="text"
            name="username"
            id="input-username"
            placeholder="Username"
            required
          />

          <input
            ref={passwordRef}
            type="password"
            name="password"
            id="input-password"
            placeholder="Password"
            required
          />

          <button type="submit">
            {isLoading ? <LoadingAnimation /> : "Log In"}
          </button>
          <p className="form-link">
            Need an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </>
  );
}
