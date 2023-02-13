import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function EditPost({
  postId,
  username,
  postBody,
  setShowModal,
  editPost,
  type,
}) {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [userMessage, setUserMessage] = useState("");

  const endpoint =
    type === "POST"
      ? "/api/posts/"
      : type === "COMMENT"
      ? "api/comments/"
      : undefined;

  const handleChange = (e) => {
    setUserMessage(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    setUserMessage(postBody);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.put(`${endpoint}/${postId}`, {
        userId: currentUser._id,
        postBody: userMessage,
      });
      setShowModal(false);
      editPost(response.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  };

  return (
    <div>
      <h1 className="modal-centered">Edit Post</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <textarea
          name="post body input"
          className="post-body-input"
          value={userMessage}
          placeholder={`What's on your mind, ${username}?`}
          onChange={handleChange}
        />
        <button disabled={userMessage === "" ? true : false} id="post-btn">
          Save
        </button>
      </form>
    </div>
  );
}
