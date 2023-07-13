import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./newPost.css";
import { toast } from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";

export default function NewPost({
  addPost,
}: {
  addPost: (post: Post) => void;
}) {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const [userMessage, setUserMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.target[0].style.height = "50px";
    try {
      const response = await axiosPrivate.post("/api/posts/new", {
        userId: currentUser._id,
        fullname: currentUser.fullname,
        username: currentUser.username,
        postBody: userMessage,
      });
      addPost(response.data);
      toast.success("Post has been created!", {
        style: {
          backgroundColor: `${theme === "light" ? "" : "#16181c"}`,
          color: `${theme === "light" ? "" : "#fff"}`,
        },
      });
    } catch (err: any) {
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
      toast.error("Error!", {
        style: {
          backgroundColor: `${theme === "light" ? "" : "#16181c"}`,
          color: `${theme === "light" ? "" : "#fff"}`,
        },
      });
    }
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
        <button disabled={userMessage === ""} type="submit" id="post-btn">
          Post
        </button>
      </form>
    </div>
  );
}
