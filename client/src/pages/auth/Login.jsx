import React, { useRef, useState } from "react";
import Axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [error, setError] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    setError("");
    if (usernameRef.current !== null && passwordRef.current !== null) {
      await Axios.post("http://localhost:3000/api/auth/login", {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      })
        .then((res) => {
          console.log(res.data);
          setCurrentUser(res.data);
          navigate("/");
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    } else {
      console.error("usernameRef.current or passwordRef.current is null");
    }
  }

  return (
    <div className="login">
      <div className="container">
        <form onSubmit={login}>
          <h2>Log In</h2>
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

          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}
