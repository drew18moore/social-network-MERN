import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import "./post.css";
import Dropdown from "../../components/dropdown/Dropdown";
import PostDropdown from "../../components/dropdown/PostDropdown";
import Modal from '../../components/modal/Modal';
import DeletePost from '../../components/modal/DeletePost';
import EditPost from '../../components/modal/EditPost';

export default function Post() {
  const { username, postId } = useParams();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);

  const { currentUser } = useAuth();
  const [post, setPost] = useState({});
  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState();

  const navigate = useNavigate();

  let time = new Date(post.createdAt);
  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
  }

  let date = new Date(post.createdAt);
  const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  useEffect(() => {
    const fetchPost = async () => {
      await api.get(`/api/posts/${username}/${postId}`).then((res) => {
        setPost(res.data);
        setLiked(res.data.likes.includes(currentUser._id))
        setNumberOfLikes(res.data.likes.length)
      })
      
    }
    fetchPost();
  }, [username, postId])

  const openDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const editPost = (newPost) => {
    let updatedPost = { ...post, postBody: newPost.postBody };
    setPost(updatedPost);
  };

  const deletePostById = () => {
    navigate("/")
  }

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
  }

  return (
    <div className='post-main'>
      <div className="post-header">
        <div className="post-header-left">
          <div className="post-pfp-btn">
            <img src={post.profilePicture} alt="profile picture" />
          </div>
          <div className="post-fullname-username">
            <div className="post-fullname">{post.fullname}</div>
            <div className="post-username">{post.username}</div>
          </div>
        </div>
        <div className="post-header-right">
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
      <div className="post-body">
        {post.postBody}
      </div>
      <div className="post-date">
        <p>{time.toLocaleString("en-US", timeOptions)}</p>
        <p className='post-dot'>&#8226;</p>
        <p>{date.toLocaleString("en-US", dateOptions)}</p>
      </div>
      <div className="post-bottom">
        <hr/>
        <div className="like-comment-share-btns">
          <div className={`like-btn ${liked ? "liked" : ""}`} onClick={likePost} >
            <span className="material-symbols-rounded">thumb_up</span>
            {numberOfLikes}
          </div>
          <div className="comment-btn">
            <span className="material-symbols-rounded">chat_bubble</span>
          </div>
          <div className="share-btn">
            <span className="material-symbols-rounded">google_plus_reshare</span>
          </div>
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
            postBody={post.postBody}
            setShowModal={setShowEditPostModal}
            editPost={editPost}
          />
        </Modal>
      )}
    </div>
  )
}
