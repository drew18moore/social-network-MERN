import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import api from "../../api/api";

export default function CommentModal({
  postId,
  fullname,
  username,
  postBody,
  profilePicture,
  date,
  setShowCommentModal,
  addComment,
}) {
  const { currentUser } = useAuth();
  const [userReply, setUserReply] = useState("");

  const handleChange = (e) => {
    setUserReply(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target[0].style.height = "50px";
    await api
      .post(`/api/posts/${postId}/comment`, {
        userId: currentUser._id,
        commentBody: userReply,
      })
      .then((res) => {
        addComment && addComment(res.data);
        setShowCommentModal(false);
      });
    setUserReply("");
  };

  return (
    <div className="comment-modal">
      <h1 className="modal-centered">Reply</h1>
      <hr />
      <div className="comment-modal-main">
        <div className="modal-post">
          <div className="modal-post-picture">
            <img src={profilePicture} alt="" />
            <div className="modal-post-spacer">
              <div className="vertical-line"></div>
            </div>
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
        <form onSubmit={handleSubmit} className="modal-comment-form">
          <div className="input-area">
            <div className="modal-comment-picture">
              <img src={currentUser.img} alt="" />
            </div>
            <textarea
              id="post-body-input"
              value={userReply}
              placeholder="Write your reply"
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            type="submit"
            id="post-btn"
            disabled={userReply === ""}
          >
            Reply
          </button>
        </form>
      </div>
    </div>
  );
}
