import React from "react";
import { useRef } from "react";
import "./newPost.css";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useState } from "react";

export default function NewPost() {
  const { currentUser } = useAuth();
  const textAreaRef = useRef();

  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    axios
      .post("http://localhost:3000/api/posts/new", {
        userId: currentUser._id,
        postBody: textAreaRef.current.value,
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  const autoResize = (e) => {
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight + 2}px`;
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="new-post-form">
        {error ? <p className="error-message">{error}</p> : ""}
        <textarea
          ref={textAreaRef}
          name="post body input"
          id="post-body-input"
          placeholder={`What's on your mind, ${currentUser.username}?`}
          onChange={autoResize}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
