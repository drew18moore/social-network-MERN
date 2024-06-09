import { useNavigate } from "react-router-dom";
import Post from "../../components/post/Post";
import LoadingAnimation from "../../components/loading/LoadingAnimation";

import "./bookmarks.css";
import { MdArrowBack } from "react-icons/md";
import useGetBookmarkedPosts from "../../hooks/posts/useGetBookmarkedPosts";

const Bookmarks = () => {
  const navigate = useNavigate();

  const { bookmarks, setBookmarks, isLoading, lastPostRef } =
    useGetBookmarkedPosts();

  const deletePostById = (postId: string) => {
    const indexToDelete = bookmarks.findIndex((x) => x._id === postId);
    let updatedBookmarks = [...bookmarks];
    updatedBookmarks.splice(indexToDelete, 1);
    setBookmarks(updatedBookmarks);
  };

  const editPost = (post: EditedPost) => {
    const indexToUpdate = bookmarks.findIndex((x) => x._id === post._id);
    let updatedBookmarks = [...bookmarks];
    updatedBookmarks[indexToUpdate].postBody = post.postBody;
    updatedBookmarks[indexToUpdate].img = post.img || "";
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
                img={post.img}
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
              img={post.img}
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
      {isLoading && (
        <div className="loading-background">
          <LoadingAnimation />
        </div>
      )}
    </div>
  );
};
export default Bookmarks;
