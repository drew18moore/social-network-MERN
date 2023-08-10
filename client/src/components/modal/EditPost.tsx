import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

type Props = {
  postId: string
  username: string
  postBody: string
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  editPost: ((newPost: EditedPost) => void) | ((comment: EditedComment) => void)
  type: "POST" | "COMMENT"
}
export default function EditPost({
  postId,
  username,
  postBody,
  setShowModal,
  editPost,
  type,
}: Props) {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [userMessage, setUserMessage] = useState("");
  const { theme } = useTheme();
  const navigate = useNavigate();

  const endpoint =
    type === "POST"
      ? "/api/posts/"
      : type === "COMMENT"
      ? "api/comments/"
      : undefined;

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
    try {
      const response = await axiosPrivate.put(`${endpoint}/${postId}`, {
        userId: currentUser._id,
        postBody: userMessage,
      });
      setShowModal(false);
      editPost(response.data);
      toast.success("Post has been updated!", {
        style: {
          backgroundColor: `${theme === "light" ? "" : "#16181c"}`,
          color: `${theme === "light" ? "" : "#fff"}`,
        },
      });
    } catch (err: any) {
      console.error(err);
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
