import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function EditPost({ postId, username, postBody, setShowModal }) {
  const [userMessage, setUserMessage] = useState("");

  const handleChange = (e) => {
    setUserMessage(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight + 2}px`;
  };

  useEffect(() => {
    setUserMessage(postBody);
  }, []);

  return (
    <div>
      <h1 className="modal-centered">Edit Post</h1>
      <hr />
      <form>
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
