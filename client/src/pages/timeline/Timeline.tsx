import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Post from "../../components/post/Post";
import NewPost from "../../components/newPost/NewPost";
import "./timeline.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { PostSkeleton } from "../../components/loading/SkeletonLoading";

export default function Timeline() {
  const [posts, setPosts] = useState<TimelinePost[]>([]);
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [isNextPage, setIsNextPage] = useState(true);

  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useCallback(
    (element: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (element && isNextPage) observer.current.observe(element);
    },
    [isLoading]
  );

  const fetchPosts = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/posts/timeline/${currentUser._id}?page=${page}&limit=${limit}`
      );
      setPosts((prev) => [...prev, ...response.data.posts]);
      setIsNextPage(response.data.numFound > 0);
      setIsLoading(false);
      console.log(response.data.posts);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };
  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [page]);

  const addPost = (post: Post) => {
    let updatedPosts = [...posts];
    updatedPosts.unshift(post);
    setPosts(updatedPosts);
  };

  const deletePostById = (postId: string) => {
    const indexToDelete = posts.findIndex((x) => x._id === postId);
    let updatedPosts = [...posts];
    updatedPosts.splice(indexToDelete, 1);
    setPosts(updatedPosts);
  };

  const editPost = (post: EditedPost) => {
    const indexToUpdate = posts.findIndex((x) => x._id === post._id);
    let updatedPosts = [...posts];
    updatedPosts[indexToUpdate].postBody = post.postBody;
    setPosts(updatedPosts);
  };

  const skeletons = () => {
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(<PostSkeleton key={i} />);
    }

    return <>{arr}</>;
  };

  return (
    <div className="timeline">
      <NewPost addPost={addPost} />
      {!isLoading && posts.length === 0 && (
        <p className="no-posts">
          No Posts
          <button onClick={() => navigate("/connect")}>Follow People</button>
        </p>
      )}
      {posts.length !== 0 && (
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
                  isLiked={post.isLiked}
                  numLikes={post.numLikes}
                  numComments={post.numComments}
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
                isLiked={post.isLiked}
                numLikes={post.numLikes}
                numComments={post.numComments}
              />
            );
          })}
        </div>
      )}
      {isLoading && <div className="post-skeleton-container">{skeletons()}</div>}
    </div>
  );
}
