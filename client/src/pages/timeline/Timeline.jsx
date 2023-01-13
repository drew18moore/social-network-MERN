import React, { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api/api";
import Post from "../../components/post/Post";
import NewPost from "../../components/newPost/NewPost";
import "./timeline.css";
import { useAuth } from "../../contexts/AuthContext";
import { useRef } from "react";
import LoadingAnimation from "../../components/loading/LoadingAnimation";

export default function Timeline() {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [isNextPage, setIsNextPage] = useState(true);

  const observer = useRef();
  const lastPostRef = useCallback(
    (element) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (element && isNextPage) observer.current.observe(element);
      console.log(element);
    },
    [isLoading]
  );

  const fetchPosts = async () => {
    await api
      .get(`/api/posts/timeline/${currentUser._id}?page=${page}&limit=${limit}`)
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data.posts]);
        setIsNextPage(res.data.numFound > 0);
        console.log("NUM_FOUND:", res.data.numFound);
        setIsLoading(false);
      })
      .catch((err) => {
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
    <div className="timeline">
      <NewPost addPost={addPost} />
      <div className="posts">
        {posts.map((post, index) => {
          if (posts.length - 1 === index) {
            return (
              <Post
                ref={lastPostRef}
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
          }
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
      {isLoading && (
        <div className="loading">
          <LoadingAnimation />
        </div>
      )}
    </div>
  );
}
