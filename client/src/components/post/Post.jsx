import React, { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Dropdown from "../dropdown/Dropdown";
import PostDropdown from "../dropdown/PostDropdown";
import Modal from "../modal/Modal";
import DeletePost from "../modal/DeletePost";
import EditPost from "../modal/EditPost";
import CommentModal from "../modal/CommentModal";
import "./post.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { MdMoreHoriz } from "react-icons/md";
import { BiComment, BiLike, BiShareAlt, BiSolidLike } from "react-icons/bi";
import ShareDropdown from "../dropdown/ShareDropdown";

const Post = forwardRef(
  (
    {
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
      numComments,
    },
    ref
  ) => {
    const [showPostDropdown, setShowPostDropdown] = useState(false);
    const [showShareDropdown, setShowShareDropdown] = useState(false);
    const [showDeletePostModal, setShowDeletePostModal] = useState(false);
    const [showEditPostModal, setShowEditPostModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [liked, setLiked] = useState();
    const [numberOfLikes, setNumberOfLikes] = useState(numLikes);
    const [numberOfComments, setNumberOfComments] = useState(numComments);

    const { currentUser } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    useEffect(() => {
      setLiked(isLiked);
    }, []);

    let date = new Date(createdAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    let dateFormated;
    if (diff < 60000) {
      dateFormated = `${Math.floor(diff / 60000)}s`;
    } else if (diff < 3600000) {
      dateFormated = `${Math.floor(diff / 60000)}m`;
    } else if (diff < 86400000) {
      dateFormated = `${Math.floor(diff / 3600000)}h`;
    } else {
      const dateOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      dateFormated = date.toLocaleString("en-US", dateOptions);
    }

    const openPostDropdown = (e) => {
      e.stopPropagation();
      setShowPostDropdown((prev) => !prev);
    };

    const openShareDropdown = (e) => {
      e.stopPropagation();
      setShowShareDropdown((prev) => !prev);
    };

    const likePost = async (e) => {
      e.stopPropagation();
      try {
        const response = await axiosPrivate.put(`/api/posts/${postId}/like`, {
          userId: currentUser._id,
        });
        setNumberOfLikes(response.data.numLikes);
        setLiked((prev) => !prev);
      } catch (err) {
        console.error(err);
      }
    };

    const openCommentModal = (e) => {
      e.stopPropagation();
      setShowCommentModal(true);
    };

    const gotoPostPage = (e) => {
      e.preventDefault();
      navigate(`/${username}/posts/${postId}`);
    };

    const gotoProfilePage = (e) => {
      e.stopPropagation();
      navigate(`/${username}`);
    };

    const btnStyles = {
      color: "green",
      "&:hover": {
        backgroundColor: "black",
      },
    };

    return (
      <div ref={ref} className="post" onClick={gotoPostPage}>
        <div className="post-content">
          <div className="post-picture">
            <div className="post-picture-btn" onClick={gotoProfilePage}>
              <img src={profilePicture} alt="Profile Picture" />
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
                <p className="post-date">{dateFormated}</p>
              </div>
              <div className="right-post-header">
                <div className="meatball-btn" onClick={openPostDropdown}>
                  <MdMoreHoriz size="1.5rem" />
                </div>
                {showPostDropdown && (
                  <Dropdown setShowDropdown={setShowPostDropdown}>
                    <PostDropdown
                      username={username}
                      setShowDropdown={setShowPostDropdown}
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
          <div
            className={`like-btn ${liked ? "liked" : ""}`}
            onClick={likePost}
          >
            <div className="btn-wrapper">
              {liked ? (
                <BiSolidLike className="like-comment-share-icons" />
              ) : (
                <BiLike className="like-comment-share-icons" />
              )}
            </div>
            {numberOfLikes}
          </div>
          <div className="comment-btn" onClick={openCommentModal}>
            <div className="btn-wrapper">
              <BiComment className="like-comment-share-icons" />
            </div>
            {numberOfComments}
          </div>
          <div className="share-btn">
            <div className="btn-wrapper" onClick={openShareDropdown}>
              <BiShareAlt className="like-comment-share-icons" />
            </div>
            {showShareDropdown && (
              <Dropdown setShowDropdown={setShowShareDropdown}>
                <ShareDropdown
                  setShowDropdown={setShowShareDropdown}
                  authorUsername={username}
                  postId={postId}
                />
              </Dropdown>
            )}
          </div>
        </div>
        {showDeletePostModal && (
          <Modal setShowModal={setShowDeletePostModal}>
            <DeletePost
              postId={postId}
              setShowModal={setShowDeletePostModal}
              deletePostById={deletePostById}
              type="POST"
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
              type="POST"
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
              setNumberOfComments={setNumberOfComments}
            />
          </Modal>
        )}
      </div>
    );
  }
);

export default Post;
