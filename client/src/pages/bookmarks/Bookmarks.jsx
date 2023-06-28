import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Post from "../../components/post/Post";
import LoadingAnimation from "../../components/loading/LoadingAnimation";

import "./bookmarks.css";
import { MdArrowBack } from "react-icons/md";

const Bookmarks = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [bookmarks, setBookmarks] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
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
    },
    [isLoading]
  );

  const fetchPosts = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/users/${currentUser._id}/bookmarks?page=${page}&limit=${limit}`
      );
      setBookmarks((prev) => [...prev, ...response.data.posts]);
      setIsNextPage(response.data.numFound > 0);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [page]);

  const deletePostById = (postId) => {
    const indexToDelete = bookmarks.findIndex((x) => x._id === postId);
    let updatedBookmarks = [...bookmarks];
    updatedBookmarks.splice(indexToDelete, 1);
    setBookmarks(updatedBookmarks);
  };

  const editPost = (post) => {
    const indexToUpdate = bookmarks.findIndex((x) => x._id === post._id);
    let updatedBookmarks = [...bookmarks];
    updatedBookmarks[indexToUpdate].postBody = post.postBody;
    setBookmarks(updatedBookmarks);
  };

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size="1.5rem" />
        </div>
        <p>Bookmarks</p>
      </div>
      <div className="bookmarks-posts">
        {bookmarks.length === 0 && <p className="no-posts">No Bookmarks</p>}
        {bookmarks.map((post, index) => {
          if (bookmarks.length - 1 === index) {
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
        <div className="loading-background">
          <LoadingAnimation />
        </div>
      )}
    </div>
  );
};
export default Bookmarks;
