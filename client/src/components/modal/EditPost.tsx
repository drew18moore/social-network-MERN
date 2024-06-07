import React, { useEffect, useState } from "react";
import useEditPost from "../../hooks/posts/useEditPost";

type Props = {
  postId: string
  username: string
  postBody: string
  img?: string
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  onEditPost: ((newPost: EditedPost) => void) | ((comment: EditedComment) => void)
  type: "POST" | "COMMENT"
}
export default function EditPost({
  postId,
  username,
  postBody,
  img,
  setShowModal,
  onEditPost,
  type,
}: Props) {
  const [userMessage, setUserMessage] = useState("");
  const { editPost } = useEditPost({ postId, onEditPost, setShowModal, type });
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    setUserMessage(postBody);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editPost({ postBody: userMessage });
  };

  return (
    <div className="edit-post-modal">
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
        {type === "POST" && <div className="img-container">
          <img src={img} alt="post image" />
        </div>}
        <button disabled={userMessage === "" ? true : false} id="post-btn">
          Save
        </button>
      </form>
    </div>
  );
}
