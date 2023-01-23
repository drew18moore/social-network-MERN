import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/api";

export default function EditProfile({ setUser, setShowModal }) {
  const fullnameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [error, setError] = useState("");

  const { currentUser, setCurrentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.put(`/api/users/${currentUser._id}`, {
        userId: currentUser._id,
        fullname: fullnameRef.current.value || currentUser.fullname,
        username: usernameRef.current.value || currentUser.username,
        password: passwordRef.current.value,
      });
      console.log(response.data);
      setCurrentUser(response.data);
      setUser(response.data);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError(err.response.data.message || err.message);
    }
  };

  return (
    <div className="edit-profile">
      <h1 className="modal-centered">Edit Profile</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        {error ? <p className="error-message">{error}</p> : ""}
        <input
          ref={fullnameRef}
          type="text"
          name="fullname"
          id="input-fullname"
          placeholder="Full Name"
        />
        <input
          ref={usernameRef}
          type="text"
          name="username"
          id="input-username"
          placeholder="Username"
        />
        <input
          ref={passwordRef}
          type="password"
          name="password"
          id="input-password"
          placeholder="Current password"
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
