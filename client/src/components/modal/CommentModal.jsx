import React from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function CommentModal({
  postId,
  fullname,
  username,
  postBody,
  profilePicture,
  date,
}) {
  const { currentUser } = useAuth();

  return (
    <div className="comment-modal">
      <h1 className="modal-centered">Reply</h1>
      <hr />
      <div className="comment-modal-main">
        <div className="modal-post">
          <div className="modal-post-picture">
            <img src={profilePicture} alt="" />
          </div>
          <div className="modal-post-text">
            <div className="modal-post-header">
              <div className="modal-post-fullname">{fullname}</div>
              <p className="modal-post-username">@{username}</p>
              <p className="modal-post-dot">&#8226;</p>
              <p className="modal-post-date">{date}</p>
            </div>
            <p className="modal-post-body">{postBody}</p>
          </div>
        </div>
        <div className="modal-post-spacer">
          <div className="vertical-line"></div>
        </div>
        <form className="modal-comment-form">
          <div className="input-area">
            <div className="modal-comment-picture">
              <img src={currentUser.img} alt="" />
            </div>
            <textarea
              id="post-body-input"
              placeholder="Write your reply"
            ></textarea>
          </div>
          <button type="submit" id="post-btn">
            Reply
          </button>
        </form>
      </div>
    </div>
  );
}
