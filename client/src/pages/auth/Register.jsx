import React, { useRef, useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./auth.css";

export default function Register() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  const [error, setError] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate()

  async function register(e) {
    e.preventDefault();
    setError("");
    if (
      usernameRef.current !== null &&
      passwordRef.current !== null &&
      passwordConfirmRef.current !== null
    ) {
      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match");
      }
      await Axios.post("http://localhost:3000/api/auth/register", {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
        passwordConfirm: passwordConfirmRef.current.value,
      })
        .then((res) => {
          console.log(res.data);
          setCurrentUser(res.data)
          navigate("/")
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    } else {
      console.error(
        "usernameRef.current, passwordRef.current, or passwordConfirmRef is null"
      );
    }
  }

  return (
    <>
      <div className="container">
        
        <form onSubmit={register} className="auth-form">
          <h2>Create a new account</h2>
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

          <input
            ref={passwordConfirmRef}
            type="password"
            name="password-confirm"
            id="input-password-confirm"
            placeholder="Confirm Password"
            required
          />

          <button type="submit">Sign Up</button>
          <p className="form-link">Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      </div>
    </>
  );
}
