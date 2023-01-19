import React, { useState } from "react";
import Dropdown from "../dropdown/Dropdown";
import PostDropdown from "../dropdown/PostDropdown";
import Modal from "../modal/Modal";
import EditPost from "../modal/EditPost";
import DeletePost from "../modal/DeletePost";
import "./comment.css";

export default function Comment({
  commentId,
  parentId,
  fullname,
  username,
  profilePicture,
  commentBody,
  editComment,
  deleteCommentById
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  return (
    <div className="comment">
      <div className="comment-pfp">
        <img src={profilePicture} alt="" />
      </div>
      <div className="comment-text">
        <div className="comment-top">
          <p className="fullname">{fullname}</p>
          <div className="comment-dropdown-wrapper">
            <div className="meatball-btn" onClick={() => setShowDropdown(true)}>
              <span className="material-symbols-outlined">more_horiz</span>
            </div>
            {showDropdown && (
              <Dropdown setShowDropdown={setShowDropdown}>
                <PostDropdown
                  username={username}
                  setShowDropdown={setShowDropdown}
                  setShowEditPostModal={setShowEditPostModal}
                  setShowDeletePostModal={setShowDeletePostModal}
                />
              </Dropdown>
            )}
          </div>
        </div>

        <p className="comment-body">{commentBody}</p>
      </div>
      {showEditPostModal && (
        <Modal setShowModal={setShowEditPostModal}>
          <EditPost
            postId={commentId}
            username={username}
            postBody={commentBody}
            setShowModal={setShowEditPostModal}
            editPost={editComment}
            type="COMMENT"
          />
        </Modal>
      )}
      {showDeletePostModal && (
        <Modal setShowModal={setShowDeletePostModal}>
          <DeletePost
            postId={commentId}
            parentId={parentId}
            setShowModal={setShowDeletePostModal}
            deletePostById={deleteCommentById}
            type="COMMENT"
          />
        </Modal>
      )}
    </div>
  );
}
