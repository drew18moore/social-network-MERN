import React from "react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

export default function DeletePost({
  postId,
  parentId,
  setShowModal,
  deletePostById,
  type,
}) {
  const { currentUser } = useAuth();
  const endpoint =
    type === "POST"
      ? "/api/posts/delete"
      : type === "COMMENT"
      ? "api/comments/delete"
      : undefined;

  const deletePost = async (postId) => {
    try {
      const response = await api.delete(`${endpoint}/${postId}`, {
        data: { userId: currentUser._id, parentId: parentId },
      });
      console.log(response.data);
      deletePostById(response.data._id);
      setShowModal(false);
    } catch (err) {
      console.error(err);
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
