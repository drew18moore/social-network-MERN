import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Dropdown from "../../components/dropdown/Dropdown";
import PostDropdown from "../../components/dropdown/PostDropdown";
import Modal from "../../components/modal/Modal";
import DeletePost from "../../components/modal/DeletePost";
import EditPost from "../../components/modal/EditPost";
import Comment from "../../components/comment/Comment";
import CommentModal from "../../components/modal/CommentModal";
import "./postPage.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  MdArrowBack,
  MdBookmark,
  MdChatBubbleOutline,
  MdMoreHoriz,
  MdOutlineBookmarkBorder,
  MdOutlineShare,
  MdOutlineThumbUp,
  MdThumbUp,
} from "react-icons/md";
import ShareDropdown from "../../components/dropdown/ShareDropdown";

export default function PostPage() {
  const { username, postId } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [showPostDropdown, setShowPostDropdown] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);

  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const { currentUser } = useAuth();
  const [post, setPost] = useState<any>({});
  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState();
  const [numberOfComments, setNumberOfComments] = useState();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  let time = new Date(post.createdAt);
  const timeOptions: any = {
    hour: "numeric",
    minute: "numeric",
  };
  const timeFormated = time.toLocaleString("en-US", timeOptions);

  let date = new Date(post.createdAt);
  const dateOptions: any = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const dateFormated = date.toLocaleString("en-US", dateOptions);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosPrivate.get(`/api/posts/${postId}`);
        setPost(response.data);
        setLiked(response.data.isLiked);
        setNumberOfLikes(response.data.numLikes);
        setNumberOfComments(response.data.comments.length);
        setIsBookmarked(response.data.isBookmarked);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    fetchPost();
  }, [username, postId]);

  const openPostDropdown = (e: any) => {
    e.stopPropagation();
    setShowPostDropdown((prev) => !prev);
  };

  const openShareDropdown = (e: any) => {
    e.stopPropagation();
    setShowShareDropdown((prev) => !prev);
  };

  const editPost = (newPost: any) => {
    let updatedPost = { ...post, postBody: newPost.postBody };
    setPost(updatedPost);
  };

  const deletePostById = () => {
    navigate("/");
  };

  const likePost = async (e: any) => {
    e.stopPropagation();
    try {
      const response = await axiosPrivate.put(`/api/posts/${postId}/like`, {
        userId: currentUser._id,
      });
      setNumberOfLikes(response.data.numLikes);
      setLiked((prev) => !prev);
    } catch (err) {
      console.error(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  const addComment = (comment: any) => {
    const newComments = [...post.comments];
    newComments.unshift({
      ...comment,
      fullname: currentUser.fullname,
      username: currentUser.username,
      profilePicture: currentUser.img || "default-pfp.jpg",
      numLikes: 0,
    });
    let updatedPost = {
      ...post,
      comments: newComments,
    };
    setPost(updatedPost);
    setNumberOfComments(updatedPost.comments.length);
  };

  const editComment = (comment: any) => {
    const indexToUpdate = post.comments.findIndex((x: any) => x._id === comment._id);
    const updatedComments = [...post.comments];
    updatedComments[indexToUpdate].commentBody = comment.commentBody;

    const updatedPost = { ...post, comments: updatedComments };
    setPost(updatedPost);
  };

  const deleteCommentById = (commentId: any) => {
    const indexToDelete = post.comments.findIndex((x: any) => x._id === commentId);
    const updatedComments = [...post.comments];
    updatedComments.splice(indexToDelete, 1);

    const updatedPost = { ...post, comments: updatedComments };
    setPost(updatedPost);
    setNumberOfComments(updatedPost.comments.length);
  };

  const bookmarkPost = async () => {
    try {
      const response = await axiosPrivate.put(`/api/posts/${postId}/bookmark`, {
        userId: currentUser._id,
      });
      setIsBookmarked((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="post-page">
      <div className="post-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size="1.5rem" />
        </div>
        <p>Post</p>
      </div>
      <div className="post-main">
        <div className="post-header">
          <div className="post-header-left">
            <div
              className="post-pfp-btn"
              onClick={() => navigate(`/${username}`)}
            >
              <img src={post.profilePicture} alt="Profile Picture" />
            </div>
            <div className="post-fullname-username">
              <div
                className="post-fullname"
                onClick={() => navigate(`/${username}`)}
              >
                {post.fullname}
              </div>
              <div className="post-username">@{post.username}</div>
            </div>
          </div>
          <div className="post-header-right">
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
        <div className="post-body">{post.postBody}</div>
        <div className="post-date">
          <p>{timeFormated}</p>
          <p className="post-dot">&#8226;</p>
          <p>{dateFormated}</p>
        </div>
        <div className="post-bottom">
          <hr />
          <div className="like-comment-share-btns">
            <div
              className={`like-btn ${liked ? "selected" : ""}`}
              onClick={likePost}
            >
              <div className="btn-wrapper">
                {liked ? (
                  <MdThumbUp className="like-comment-share-icons" />
                ) : (
                  <MdOutlineThumbUp className="like-comment-share-icons" />
                )}
              </div>
              {numberOfLikes}
            </div>
            <div
              className="comment-btn"
              onClick={() => setShowCommentModal(true)}
            >
              <div className="btn-wrapper">
                <MdChatBubbleOutline className="like-comment-share-icons" />
              </div>
              {numberOfComments}
            </div>
            <div
              className={`bookmark-btn ${isBookmarked ? "selected" : ""}`}
              onClick={bookmarkPost}
            >
              <div className="btn-wrapper">
                {isBookmarked ? (
                  <MdBookmark className="like-comment-share-icons" />
                ) : (
                  <MdOutlineBookmarkBorder className="like-comment-share-icons" />
                )}
              </div>
            </div>
            <div className="share-btn">
              <div className="btn-wrapper" onClick={openShareDropdown}>
                <MdOutlineShare className="like-comment-share-icons" />
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
              postBody={post.postBody}
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
              fullname={post.fullname}
              username={username}
              postBody={post.postBody}
              profilePicture={post.profilePicture}
              date={dateFormated}
              setShowCommentModal={setShowCommentModal}
              addComment={addComment}
            />
          </Modal>
        )}
      </div>
      <div className="comment-section">
        <h2>Comments</h2>
        <div className="comments">
          {post.comments &&
            post.comments.map((comment: any) => {
              return (
                <Comment
                  key={comment._id}
                  commentId={comment._id}
                  parentId={postId!}
                  fullname={comment.fullname}
                  username={comment.username}
                  profilePicture={comment.profilePicture}
                  commentBody={comment.commentBody}
                  editComment={editComment}
                  deleteCommentById={deleteCommentById}
                  liked={comment.isLiked}
                  numberOfLikes={comment.numLikes}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
