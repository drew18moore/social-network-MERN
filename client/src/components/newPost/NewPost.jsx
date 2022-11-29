import React from "react";
import "./newPost.css";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useState } from "react";

export default function NewPost() {
  const { currentUser } = useAuth();
  const [userMessage, setUserMessage] = useState("");

  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    await axios
      .post("http://localhost:3000/api/posts/new", {
        userId: currentUser._id,
        postBody: userMessage,
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
    setUserMessage("")
  };

  const handleChange = (e) => {
    setUserMessage(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight + 2}px`;
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="new-post-form">
        {error ? <p className="error-message">{error}</p> : ""}
        <textarea
          name="post body input"
          id="post-body-input"
          value={userMessage}
          placeholder={`What's on your mind, ${currentUser.username}?`}
          onChange={handleChange}
        />
        <button disabled={userMessage === "" ? true : false} type="submit">
          Post
        </button>
      </form>
    </div>
  );
}
