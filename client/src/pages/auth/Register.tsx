import React, { useRef } from "react";
import { Link } from "react-router-dom";
import LoadingAnimation from "../../components/loading/LoadingAnimation";
import "./auth.css";
import useRegister from "../../hooks/auth/useRegister";

export default function Register() {
  const displayNameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const { register, isLoading, error } = useRegister();

  async function onRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await register({
      displayName: displayNameRef.current?.value.trim()!,
      username: usernameRef.current?.value.trim().toLowerCase()!,
      password: passwordRef.current?.value!,
      passwordConfirm: passwordConfirmRef.current?.value!,
    });
  }

  return (
    <>
      <div className="auth-container">
        <form onSubmit={onRegister} className="auth-form">
          <h2 className="auth-heading">Create a new account</h2>
          {error ? <p className="error-message">{error}</p> : ""}
          <input
            ref={displayNameRef}
            type="text"
            name="fullname"
            id="input-fullname"
            placeholder="Display Name"
            required
          />

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

          <input
            ref={passwordConfirmRef}
            type="password"
            name="password-confirm"
            id="input-password-confirm"
            placeholder="Confirm Password"
            required
          />

          <button type="submit">
            {isLoading ? <LoadingAnimation /> : "Sign Up"}
          </button>
          <p className="form-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </>
  );
}
