import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Post from "../post/Post";
import NewPost from "../newPost/NewPost";
import "./timeline.css"

export default function Timeline() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    await axios
      .get("http://localhost:3000/api/posts/timeline")
      .then((res) => {
        setPosts(res.data);
      })
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = (post) => {
    let updatedPosts = [...posts]
    updatedPosts.unshift(post)
    setPosts(updatedPosts)
  }

  return (
    <>
      <NewPost addPost={addPost}/>
      <div className="posts">
        {posts.map(post => {
          return <Post key={post._id} fullname={post.fullname} username={post.username} postBody={post.postBody} createdAt={post.createdAt}/>
        })}
      </div>
    </>
  )
}
