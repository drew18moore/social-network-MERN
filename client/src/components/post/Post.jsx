import React from "react";
import { useState } from "react";
import Dropdown from "../dropdown/Dropdown";
import PostDropdown from "../dropdown/PostDropdown";
import "./post.css";
import Modal from "../modal/Modal";
import DeletePost from "../modal/DeletePost";
import EditPost from "../modal/EditPost";
import CommentModal from "../modal/CommentModal";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Post({
  postId,
  fullname,
  username,
  postBody,
  createdAt,
  profilePicture,
  deletePostById,
  editPost,
  isLiked,
  numLikes,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [liked, setLiked] = useState();
  const [numberOfLikes, setNumberOfLikes] = useState(numLikes);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLiked(isLiked);
  }, []);

  let date = new Date(createdAt);
  const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const dateFormated = date.toLocaleString("en-US", dateOptions)

  const openDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const likePost = (e) => {
    e.stopPropagation();
    api
      .put(`/api/posts/like/${postId}`, {
        userId: currentUser._id,
      })
      .then((res) => {
        console.log(res.data);
        setNumberOfLikes(res.data.numLikes);
        setLiked((prev) => !prev);
      });
  };

  const openCommentModal = (e) => {
    e.stopPropagation();
    setShowCommentModal(true);
  }

  const gotoPostPage = (e) => {
    e.preventDefault();
    navigate(`/${username}/posts/${postId}`);
  };

  const gotoProfilePage = (e) => {
    e.stopPropagation();
    navigate(`/${username}`)
  }

  return (
    <div className="post" onClick={gotoPostPage}>
      <div className="post-content">
        <div className="post-picture">
          <div className="post-picture-btn" onClick={gotoProfilePage}>
            <img src={profilePicture} alt="" />
          </div>
        </div>
        <div className="post-text">
          <div className="post-header">
            <div className="left-post-header">
              <div className="post-fullname-link" onClick={gotoProfilePage}>
                <p className="post-fullname">{fullname}</p>
              </div>

              <p className="post-username">@{username}</p>
              <p className="post-dot">&#8226;</p>
              <p className="post-date">
                {dateFormated}
              </p>
            </div>
            <div className="right-post-header">
              <div className="meatball-btn" onClick={openDropdown}>
                <span className="material-symbols-outlined">more_horiz</span>
              </div>
              {showDropdown && (
                <Dropdown setShowDropdown={setShowDropdown}>
                  <PostDropdown
                    username={username}
                    setShowDropdown={setShowDropdown}
                    setShowDeletePostModal={setShowDeletePostModal}
                    setShowEditPostModal={setShowEditPostModal}
                  />
                </Dropdown>
              )}
            </div>
          </div>
          <p className="post-body">{postBody}</p>
        </div>
      </div>
      <hr />
      <div className="like-comment-share-btns">
        <div className={`like-btn ${liked ? "liked" : ""}`} onClick={likePost}>
          <span className="material-symbols-rounded">thumb_up</span>
          {numberOfLikes}
        </div>
        <div className="comment-btn" onClick={openCommentModal}>
          <span className="material-symbols-rounded">chat_bubble</span>
        </div>
        <div className="share-btn">
          <span className="material-symbols-rounded">google_plus_reshare</span>
        </div>
      </div>
      {showDeletePostModal && (
        <Modal setShowModal={setShowDeletePostModal}>
          <DeletePost
            postId={postId}
            setShowModal={setShowDeletePostModal}
            deletePostById={deletePostById}
          />
        </Modal>
      )}
      {showEditPostModal && (
        <Modal setShowModal={setShowEditPostModal}>
          <EditPost
            postId={postId}
            username={username}
            postBody={postBody}
            setShowModal={setShowEditPostModal}
            editPost={editPost}
          />
        </Modal>
      )}
      {showCommentModal && (
        <Modal setShowModal={setShowCommentModal}>
          <CommentModal 
            postId={postId}
            fullname={fullname}
            username={username}
            postBody={postBody}
            profilePicture={profilePicture}
            date={dateFormated}
            setShowCommentModal={setShowCommentModal}
          />
        </Modal>
      )}
    </div>
  );
}
