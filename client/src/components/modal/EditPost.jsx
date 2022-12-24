import api from "../../api/api";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function EditPost({ postId, username, postBody, setShowModal, editPost }) {
  const { currentUser } = useAuth()
  const [userMessage, setUserMessage] = useState("");

  const handleChange = (e) => {
    setUserMessage(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight + 2}px`;
  };

  useEffect(() => {
    setUserMessage(postBody);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    api.put(`/api/posts/edit/${postId}`, {
      userId: currentUser._id,
      postBody: userMessage
    }).then((res) => {
      console.log(res.data)
      setShowModal(false);
      editPost(res.data)
    })
  }

  return (
    <div>
      <h1 className="modal-centered">Edit Post</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <textarea
          name="post body input"
          id="post-body-input"
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
