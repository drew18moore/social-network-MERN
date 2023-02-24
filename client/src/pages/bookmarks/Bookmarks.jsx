import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Post from "../../components/post/Post";

import "./bookmarks.css";

const Bookmarks = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [bookmarks, setBookmarks] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/users/${currentUser._id}/bookmarks`
      );
      setBookmarks(response.data.posts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <p>Bookmarks</p>
      </div>
      <div className="bookmarks-posts">
        {bookmarks.length === 0 && <p className="no-posts">No Bookmarks</p>}
        {bookmarks.map((post) => {
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
    </div>
  );
};
export default Bookmarks;
