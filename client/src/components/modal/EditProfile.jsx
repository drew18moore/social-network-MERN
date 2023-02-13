import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function EditProfile({ setUser, setShowModal }) {
  const fullnameRef = useRef(null);
  const usernameRef = useRef(null);
  const [password, setPassword ] = useState("");

  const [error, setError] = useState("");

  const { currentUser, setCurrentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosPrivate.put(`/api/users/${currentUser._id}`, {
        userId: currentUser._id,
        fullname: fullnameRef.current.value.trim() || currentUser.fullname,
        username: usernameRef.current.value.trim().toLowerCase() || currentUser.username,
        password: password,
      });
      setCurrentUser(response.data);
      setUser(response.data);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError(err.response.data.message || err.message);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
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
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          id="input-password"
          placeholder="Current password"
          required
        />
        <button type="submit" disabled={password === ""}>Save</button>
      </form>
    </div>
  );
}
