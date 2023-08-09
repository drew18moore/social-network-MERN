import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

type Props = {
  postId: string
  fullname: string
  username: string
  postBody: string
  profilePicture: string
  date: string
  setShowCommentModal: React.Dispatch<React.SetStateAction<boolean>>
  addComment?: (comment: NewComment) => void
  setNumberOfComments?: React.Dispatch<React.SetStateAction<number>>
}

export default function CommentModal({
  postId,
  fullname,
  username,
  postBody,
  profilePicture,
  date,
  setShowCommentModal,
  addComment,
  setNumberOfComments,
}: Props) {
  const { currentUser } = useAuth();
  const [userReply, setUserReply] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserReply(e.target.value);
    e.target.style.height = "50px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.target[0].style.height = "50px";
    try {
      const response = await axiosPrivate.post("/api/comments/new", {
        userId: currentUser._id,
        parentId: postId,
        commentBody: userReply,
      });
      addComment && addComment(response.data);
      setShowCommentModal(false);
      setNumberOfComments && setNumberOfComments((prev) => prev + 1);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setUserReply("");
  };

  return (
    <div className="comment-modal">
      <h1 className="modal-centered">Reply</h1>
      <hr />
      <div className="comment-modal-main">
        <div className="modal-post">
          <div className="modal-post-picture">
            <img src={profilePicture} alt="Profile Picture" />
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
              <img src={currentUser.img || "/default-pfp.jpg" } alt="Current User Profile Picture" />
            </div>
            <textarea
              className="post-body-input"
              value={userReply}
              placeholder="Write your reply"
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" id="post-btn" disabled={userReply === ""}>
            Reply
          </button>
        </form>
      </div>
    </div>
  );
}
