import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import api from '../../api/api';
import "./post.css";

export default function Post() {
  const { username, postId } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      await api.get(`/api/posts/${username}/${postId}`).then((res) => {
        setPost(res.data);
      })
      
    }
    fetchPost();
  }, [username, postId])

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
          <div className="meatball-btn">
            <span className="material-symbols-outlined">more_horiz</span>
          </div>
        </div>
      </div>
      
    </div>
  )
}
