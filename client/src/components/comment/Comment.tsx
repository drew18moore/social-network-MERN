import React, { useState } from "react";
import Dropdown from "../dropdown/Dropdown";
import PostDropdown from "../dropdown/PostDropdown";
import Modal from "../modal/Modal";
import EditPost from "../modal/EditPost";
import DeletePost from "../modal/DeletePost";
import "./comment.css";
import { axiosPrivate } from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import { MdMoreHoriz } from "react-icons/md";

type Props = {
  commentId: string
  parentId: string
  fullname: string
  username: string
  profilePicture: string
  commentBody: string
  editComment: (comment: EditedComment) => void
  deleteCommentById: (commentId: string) => void
  liked: boolean
  numberOfLikes: number
}

export default function Comment({
  commentId,
  parentId,
  fullname,
  username,
  profilePicture,
  commentBody,
  editComment,
  deleteCommentById,
  liked,
  numberOfLikes
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [numLikes, setNumLikes] = useState(numberOfLikes);
  const { currentUser } = useAuth();

  const likeComment = async () => {
    try {
      const response = await axiosPrivate.put(
        `/api/comments/${commentId}/like`,
        {
          userId: currentUser._id,
        }
      );
      console.log(response.data);
      setIsLiked((prev) => !prev);
      setNumLikes(response.data.numLikes);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="comment">
      <div className="comment-pfp">
        <img src={profilePicture} alt="Profile Picture" />
      </div>
      <div className="comment-text">
        <div className="comment-top">
          <p className="fullname">{fullname}</p>
          <div className="comment-dropdown-wrapper">
            <div className="meatball-btn" onClick={() => setShowDropdown(true)}>
              <MdMoreHoriz size="1.4rem" />
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
        <div className="like-section">
          <button
            className={`like-btn ${isLiked ? "liked" : ""}`}
            onClick={likeComment}
          >
            Like
          </button>
          <span className="dot">&#8226;</span>
          <span className="like-count">{numLikes}</span>
        </div>
      </div>
      {showEditPostModal && (
        <Modal setShowModal={setShowEditPostModal}>
          <EditPost
            postId={commentId}
            username={username}
            postBody={commentBody}
            setShowModal={setShowEditPostModal}
            onEditPost={editComment}
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
