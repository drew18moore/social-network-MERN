import React, { useRef, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LoadingAnimation from "../../components/loading/LoadingAnimation";

export default function Login() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    setError("");
    if (usernameRef.current !== null && passwordRef.current !== null) {
      setIsLoading(true);
      await api
        .post("/api/auth/login", {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        })
        .then((res) => {
          console.log(res.data);
          setCurrentUser(res.data);
          setIsLoading(false);
          navigate("/");
        })
        .catch((err) => {
          setIsLoading(false);
          setError(err.response.data.message);
        });
    } else {
      console.error("usernameRef.current or passwordRef.current is null");
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

          <button type="submit">{isLoading ? <LoadingAnimation /> : "Log In"}</button>
          <p className="form-link">
            Need an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </>
  );
}
