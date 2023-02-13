import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./newPost.css";

export default function NewPost({ addPost }) {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [userMessage, setUserMessage] = useState("");

  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target[0].style.height = "50px";
    setError("");
    try {
      const response = await axiosPrivate.post("/api/posts/new", {
        userId: currentUser._id,
        fullname: currentUser.fullname,
        username: currentUser.username,
        postBody: userMessage,
      });
      addPost(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
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
        {error && <p className="error-message">{error}</p>}
        <div className="input-area">
          <Link className="input-pfp" to={`/${currentUser.username}`}>
            <img src={currentUser.img || "/default-pfp.jpg"} alt="" />
          </Link>
          <textarea
            name="post body input"
            className="post-body-input"
            value={userMessage}
            placeholder={`What's on your mind, ${currentUser.username}?`}
            onChange={handleChange}
          />
        </div>
        <button disabled={userMessage === ""} type="submit" id="post-btn">
          Post
        </button>
      </form>
    </div>
  );
}
