import React from "react";

export default function CommentModal({
  postId,
  fullname,
  username,
  postBody,
  profilePicture,
  date
}) {
  return (
    <div className="comment-modal">
      <h1 className="modal-centered">Write a Comment</h1>
      <hr />
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
    </div>
  );
}
