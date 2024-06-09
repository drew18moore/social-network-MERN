import React, { useEffect, useState } from "react";
import useEditPost from "../../hooks/posts/useEditPost";
import { MdOutlineClose, MdOutlineImage } from "react-icons/md";
import Resizer from "react-image-file-resizer";
// @ts-expect-error https://github.com/onurzorluer/react-image-file-resizer/issues/68
const resizer: typeof Resizer = Resizer.default || Resizer;

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

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("IMG CHANGE");
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      resizer.imageFileResizer(
        file,
        400,
        400,
        "JPEG",
        80,
        0,
        (uri) => {
          setPostImg(uri as string);
        },
        "base64"
      );
    } else {
      setPostImg("");
    }

    e.target.value = "";
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
        <div className="btns-container">
          <button disabled={userMessage === "" && postImg === "" ? true : false} id="post-btn">
            Save
          </button>
          <label htmlFor="edit-post-file">
            <MdOutlineImage size="1.5rem" />
            {postImg === "" ? "Add a photo" : "Change photo"}
          </label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            id="edit-post-file"
            onChange={handleImgChange}
          />
        </div>
      </form>
    </div>
  );
}
