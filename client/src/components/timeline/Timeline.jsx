import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

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

  return (
    <div className="posts">
      {posts.map(post => {
        return <p key={post._id}>{post.postBody}</p>
      })}
    </div>)
}
