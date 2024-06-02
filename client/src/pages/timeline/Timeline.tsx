import Post from "../../components/post/Post";
import NewPost from "../../components/newPost/NewPost";
import "./timeline.css";
import { useNavigate } from "react-router-dom";
import { PostSkeleton } from "../../components/loading/SkeletonLoading";
import useGetTimelinePosts from "../../hooks/posts/useGetTimelinePosts";

export default function Timeline() {
  const navigate = useNavigate();
  const { posts, setPosts, isLoading, lastPostRef } = useGetTimelinePosts();

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
      )}
      {isLoading && (
        <div className="post-skeleton-container">{skeletons()}</div>
      )}
    </div>
  );
}
