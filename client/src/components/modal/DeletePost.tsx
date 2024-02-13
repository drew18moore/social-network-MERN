import React from "react";
import useDeletePost from "../../hooks/posts/useDeletePost";

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
  const { deletePost } = useDeletePost({ postId, parentId, onDeletePost: deletePostById, setShowModal, type });

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
        <button onClick={(deletePost)} className="delete-btn">
          Delete Post
        </button>{" "}
      </div>
    </div>
  );
}
