import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function EditProfile({ setUser, setShowModal }) {
  const fullnameRef = useRef(null);
  const usernameRef = useRef(null);
  const bioRef = useRef(null);
  const [password, setPassword ] = useState("");

  const [error, setError] = useState("");

  const { currentUser, setCurrentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosPrivate.put(`/api/users/${currentUser._id}`, {
        userId: currentUser._id,
        fullname: fullnameRef.current.value.trim() || currentUser.fullname,
        username: usernameRef.current.value.trim().toLowerCase() || currentUser.username,
        bio: bioRef.current.value.trim() || currentUser.bio,
        password: password,
      });
      const { fullname, username, bio } = response.data;
      setCurrentUser(prev => ({ ...prev, fullname, username, bio }));
      setUser(prev => ({ ...prev, fullname, username, bio }));
      setShowModal(false);
      navigate(`/${username}`, { replace: true })
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
          placeholder="Display Name"
        />
        <input
          ref={usernameRef}
          type="text"
          name="username"
          id="input-username"
          placeholder="Username"
        />
        <input
          ref={bioRef}
          type="text"
          name="bio"
          id="input-bio"
          placeholder="Bio"
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
