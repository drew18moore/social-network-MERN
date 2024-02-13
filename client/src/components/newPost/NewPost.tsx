import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./newPost.css";
import useNewPost from "../../hooks/posts/useNewPost";

export default function NewPost({
  addPost,
}: {
  addPost: (post: Post) => void;
}) {
  const { newPost } = useNewPost({ onAddPost: addPost });
  const { currentUser } = useAuth();

  const [userMessage, setUserMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.target[0].style.height = "50px";
    newPost({ postBody: userMessage.trim() });
    setUserMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="new-post-form">
        <div className="input-area">
          <Link className="input-pfp" to={`/${currentUser.username}`}>
            <img
              src={currentUser.img || "/default-pfp.jpg"}
              alt="Current User Profile Picture"
            />
          </Link>
          <textarea
            name="post body input"
            className="post-body-input"
            value={userMessage}
            placeholder={`What's on your mind, ${currentUser.username}?`}
            onChange={handleChange}
          />
        </div>
        <button
          disabled={userMessage.trim() === ""}
          type="submit"
          id="post-btn"
        >
          Post
        </button>
      </form>
    </div>
  );
}
