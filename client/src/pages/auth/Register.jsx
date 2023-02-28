import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import LoadingAnimation from "../../components/loading/LoadingAnimation";
import "./auth.css";

export default function Register() {
  const fullnameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  async function register(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (passwordRef.current.value !== passwordConfirmRef.current.value)
        throw new Error("Passwords do not match");
      const response = await api.post(
        "/api/auth/register",
        {
          fullname: fullnameRef.current.value.trim(),
          username: usernameRef.current.value.trim().toLowerCase(),
          password: passwordRef.current.value,
          passwordConfirm: passwordConfirmRef.current.value,
        },
        {
          withCredentials: true,
        }
      );
      setCurrentUser(response.data);
      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <>
      <div className="auth-container">
        <form onSubmit={register} className="auth-form">
          <h2 className="auth-heading">Create a new account</h2>
          {error ? <p className="error-message">{error}</p> : ""}
          <input
            ref={fullnameRef}
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
