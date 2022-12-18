import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Post from "../../components/post/Post";
import NewPost from "../../components/newPost/NewPost";
import "./timeline.css";
import { useAuth } from "../../contexts/AuthContext";

export default function Timeline() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();

  const fetchPosts = async () => {
    await axios
      .get("http://192.168.1.2:3000/api/posts/timeline")
      .then((res) => {
        setPosts(res.data);
      });
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = (post) => {
    let updatedPosts = [...posts];
    updatedPosts.unshift(post);
    setPosts(updatedPosts);
  };

  const deletePostById = (postId) => {
    const indexToDelete = posts.findIndex((x) => x._id === postId);
    console.log(indexToDelete);
    let updatedPosts = [...posts];
    updatedPosts.splice(indexToDelete, 1);
    setPosts(updatedPosts);
  };

  const editPost = (post) => {
    const indexToUpdate = posts.findIndex((x) => x._id === post._id);
    let updatedPosts = [...posts];
    updatedPosts[indexToUpdate].postBody = post.postBody;
    setPosts(updatedPosts);
  };

  return (
    <main className="timeline-main">
      <NewPost addPost={addPost} />
      <div className="posts">
        {posts.map((post) => {
          return (
            <Post
              key={post._id}
              postId={post._id}
              fullname={post.fullname}
              username={post.username}
              postBody={post.postBody}
              createdAt={post.createdAt}
              profilePicture={post.profilePicture}
              deletePostById={deletePostById}
              editPost={editPost}
              isLiked={post.likes.includes(currentUser._id) }
            />
          );
        })}
      </div>
    </main>
  );
}