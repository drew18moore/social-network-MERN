import React from "react";
import { useState } from "react";
import Dropdown from "../dropdown/Dropdown";
import PostDropdown from "../dropdown/PostDropdown";
import "./post.css";
import Modal from "../modal/Modal"
import DeletePost from "../modal/DeletePost";

export default function Post({ postId, fullname, username, postBody, createdAt, deletePostById }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);

  let date = new Date(createdAt);
  const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const openDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="post">
      <div className="post-content">
        <div className="post-picture">
          <img src="/default-pfp.jpg" alt="" />
        </div>
        <div className="post-text">
          <div className="post-header">
            <div className="left-post-header">
              <p className="post-fullname">{fullname}</p>
              <p className="post-username">@{username}</p>
              <p className="post-dot">&#8226;</p>
              <p className="post-date">
                {date.toLocaleString("en-US", dateOptions)}
              </p>
            </div>
            <div className="right-post-header">
              <div className="meatball-btn" onClick={openDropdown}>
                <span className="material-symbols-outlined">more_horiz</span>
              </div>
              {showDropdown && (
                <Dropdown setShowDropdown={setShowDropdown}>
                  <PostDropdown username={username} setShowDropdown={setShowDropdown} setShowDeletePostModal={setShowDeletePostModal}/>
                </Dropdown>
              )}
            </div>
          </div>
          <p className="post-body">{postBody}</p>
        </div>
      </div>
      <hr />
      <div className="like-comment-share-btns">
        <span className="material-symbols-rounded">thumb_up</span>
        <span className="material-symbols-rounded">chat_bubble</span>
        <span className="material-symbols-rounded">google_plus_reshare</span>
      </div>
      {showDeletePostModal && (
        <Modal setShowModal={setShowDeletePostModal}>
          <DeletePost postId={postId} setShowModal={setShowDeletePostModal} deletePostById={deletePostById}/>
        </Modal>
      )}
    </div>
  );
}
