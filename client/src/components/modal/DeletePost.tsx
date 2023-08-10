import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

type Props = {
  postId: string
  parentId?: string
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  deletePostById: ((postId: string) => void) | ((commentId: string) => void)
  type: "POST" | "COMMENT"
}
export default function DeletePost({
  postId,
  parentId,
  setShowModal,
  deletePostById,
  type,
}: Props) {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const endpoint =
    type === "POST"
      ? "/api/posts"
      : type === "COMMENT"
      ? "api/comments"
      : undefined;

  const deletePost = async (postId: string) => {
    try {
      const response = await axiosPrivate.delete(`${endpoint}/${postId}`, {
        data: { userId: currentUser._id, parentId: parentId },
      });
      deletePostById(response.data._id);
      setShowModal(false);
      toast.success("Post has been deleted!", {
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
      <h1 className="modal-centered">Delete Post?</h1>
      <hr />
      <h4 className="modal-centered">This action can't be undone</h4>
      <div className="modal-btns">
        <button
          type="button"
          onClick={() => setShowModal((prev) => !prev)}
          className="cancel-btn"
        >
          Cancel
        </button>
        <button onClick={() => deletePost(postId)} className="delete-btn">
          Delete Post
        </button>{" "}
      </div>
    </div>
  );
}
