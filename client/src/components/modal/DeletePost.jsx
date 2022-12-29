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
  console.log(parentId);
  const { currentUser } = useAuth();
  console.log(type)
  const endpoint =
    type === "POST"
      ? "/api/posts/delete"
      : type === "COMMENT"
      ? "api/comments/delete"
      : undefined;

  const deletePost = async (postId) => {
    await api
      .delete(`${endpoint}/${postId}`, {
        data: { userId: currentUser._id, parentId: parentId },
      })
      .then((res) => {
        console.log(res.data);
        deletePostById(res.data._id);
        setShowModal(false);
      });
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
          Delete
        </button>{" "}
      </div>
    </div>
  );
}
