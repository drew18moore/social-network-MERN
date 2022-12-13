import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

export default function EditProfile({ setShowModal }) {
  const fullnameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [error, setError] = useState("");

  const { currentUser, setCurrentUser } = useAuth();

  const handleSubmit = (e) => {
    console.log(currentUser.password)
    e.preventDefault();
    setError("");
    console.log(fullnameRef.current.value ? fullnameRef.current.value : currentUser.fullname)

    if (passwordRef.current !== null) {
      if (passwordRef.current.value === currentUser.password) {
        axios.put(`http://192.168.1.2:3000/api/users/${currentUser._id}`, {
          userId: currentUser._id,
          fullname: fullnameRef.current.value ? fullnameRef.current.value : currentUser.fullname,
          username: usernameRef.current.value ? usernameRef.current.value : currentUser.username,
          password: passwordRef.current.value
        }).then(res => {
          console.log(res.data);
          setCurrentUser(res.data);
          setShowModal(false);
        })
      } else {
        setError("Password doesn't match current user's password")
        console.error("Password doesn't match current user's password")
      }
    } else {
      console.error(
        "passwordRef.current is null"
      );
    }
  }

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
            placeholder="Password"
            required
          />
          <button type="submit">Submit</button>
      </form>
    </div>
  );
}
