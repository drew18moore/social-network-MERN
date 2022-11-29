import React from "react";
import { useRef } from "react";
import "./newPost.css";
import { useAuth } from "../../contexts/AuthContext"

export default function NewPost() {
  const { currentUser } = useAuth()
  const textAreaRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const autoResize = (e) => {
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight + 2}px`;
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="new-post-form">
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
