import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/api";
import Post from "../../components/post/Post";
import NewPost from "../../components/newPost/NewPost";
import "./timeline.css";
import { useAuth } from "../../contexts/AuthContext";
import { useRef } from "react";

export default function Timeline() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchPosts = async () => {
    await api
      .get(`/api/posts/timeline/${currentUser._id}?page=${page}&limit=${limit}`)
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data]);
        setIsLoading(false);
      }).catch((err) => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [page]);

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
    <>
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
              isLiked={post.likes.includes(currentUser._id)}
              numLikes={post.likes.length}
              numComments={post.comments.length}
            />
          );
        })}
      </div>
    </>
  );
}
