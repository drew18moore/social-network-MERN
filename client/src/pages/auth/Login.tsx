import React, { useRef } from "react";
import { Link } from "react-router-dom";
import LoadingAnimation from "../../components/loading/LoadingAnimation";
import useLogin from "../../hooks/auth/useLogin";

export default function Login() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login, isLoading, error } = useLogin();

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await login({
      username: usernameRef.current?.value.trim().toLowerCase()!,
      password: passwordRef.current?.value!,
    });
  }

  return (
    <>
      <div className="auth-container">
        <form onSubmit={onLogin} className="auth-form">
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
