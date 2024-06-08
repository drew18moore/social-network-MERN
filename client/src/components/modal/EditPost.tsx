import React, { useEffect, useState } from "react";
import useEditPost from "../../hooks/posts/useEditPost";
import { MdOutlineClose } from "react-icons/md";

type Props = {
  postId: string;
  username: string;
  postBody: string;
  img?: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onEditPost:
    | ((newPost: EditedPost) => void)
    | ((comment: EditedComment) => void);
  type: "POST" | "COMMENT";
};
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
  const [postImg, setPostImg] = useState("");
  const { editPost } = useEditPost({ postId, onEditPost, setShowModal, type });
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    setUserMessage(postBody);
    setPostImg(img || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editPost({ postBody: userMessage, postImg: postImg });
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
        {type === "POST" && postImg !== "" && (
          <div className="img-container">
            <span
              className="remove-img-btn"
              onClick={() => {
                setPostImg("");
              }}
            >
              <MdOutlineClose size="1.5rem" />
            </span>
            <img src={postImg} alt="post image" />
          </div>
        )}
        <button disabled={userMessage === "" ? true : false} id="post-btn">
          Save
        </button>
      </form>
    </div>
  );
}
