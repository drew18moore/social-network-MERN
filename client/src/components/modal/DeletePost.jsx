import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export default function DeletePost({
  postId,
  parentId,
  setShowModal,
  deletePostById,
  type,
}) {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const endpoint =
    type === "POST"
      ? "/api/posts"
      : type === "COMMENT"
      ? "api/comments"
      : undefined;

  const deletePost = async (postId) => {
    try {
      const response = await axiosPrivate.delete(`${endpoint}/${postId}`, {
        data: { userId: currentUser._id, parentId: parentId },
      });
      deletePostById(response.data._id);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
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
