import React from "react";
import "./newPost.css";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/api";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NewPost({ addPost }) {
  const { currentUser } = useAuth();
  const [userMessage, setUserMessage] = useState("");

  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target[0].style.height = "50px";
    setError("");
    await api
      .post("/api/posts/new", {
        userId: currentUser._id,
        fullname: currentUser.fullname,
        username: currentUser.username,
        postBody: userMessage,
      })
      .then((res) => {
        addPost(res.data);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
    setUserMessage("");
  };

  const handleChange = (e) => {
    setUserMessage(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="new-post-form">
        {error ? <p className="error-message">{error}</p> : ""}
        <div className="input-area">
          <Link className="input-pfp" to={`/${currentUser.username}`}>
            <img src={currentUser.img || "/default-pfp.jpg"} alt="" />
          </Link>
          <textarea
            name="post body input"
            id="post-body-input"
            value={userMessage}
            placeholder={`What's on your mind, ${currentUser.username}?`}
            onChange={handleChange}
          />
        </div>
        <button
          disabled={userMessage === ""}
          type="submit"
          id="post-btn"
        >
          Post
        </button>
      </form>
    </div>
  );
}
