import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./newPost.css";
import useNewPost from "../../hooks/posts/useNewPost";
import Resizer from "react-image-file-resizer";
// @ts-expect-error https://github.com/onurzorluer/react-image-file-resizer/issues/68
const resizer: typeof Resizer = Resizer.default || Resizer;
import { MdOutlineImage  } from "react-icons/md";

export default function NewPost({
  addPost,
}: {
  addPost: (post: Post) => void;
}) {
  const [imgBase64, setImgBase64] = useState("");
  const { newPost } = useNewPost({ onAddPost: addPost });
  const { currentUser } = useAuth();

  const [userMessage, setUserMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.target[0].style.height = "50px";
    newPost({ postBody: userMessage.trim(), img: imgBase64 });
    setUserMessage("");
    setImgBase64("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMessage(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setImgBase64(uri as string);
        },
        "base64"
      );
    } else {
      setImgBase64("");
    }
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
        <input
          type="file"
          accept="image/*"
          id="file"
          onChange={handleImgChange}
        />
        <label htmlFor="file"><MdOutlineImage  size="1.5rem" />Upload a photo</label>
        {imgBase64 && <img src={imgBase64} alt="post img" />}
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
