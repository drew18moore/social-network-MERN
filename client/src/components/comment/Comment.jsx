import React from "react";
import "./comment.css";
import { useState } from "react";
import Dropdown from "../dropdown/Dropdown";
import PostDropdown from "../dropdown/PostDropdown";
import Modal from "../modal/Modal";
import EditPost from "../modal/EditPost";

export default function Comment({
  commentId,
  fullname,
  username,
  profilePicture,
  commentBody,
  editComment,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);

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
    </div>
  );
}
