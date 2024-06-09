import Post from "../../components/post/Post";
import useGetProfilePosts from "../../hooks/posts/useGetProfilePosts";

const ProfilePosts = ({
  username
}: {
  username: string | undefined
}) => {

  const {
    posts,
    setPosts,
    isLoading: isLoadingPosts,
    lastPostRef,
  } = useGetProfilePosts({
    username,
  });

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
    updatedPosts[indexToUpdate].img = post.img || "";
    setPosts(updatedPosts);
  };

  return (
    <div className="posts-container">
      <h2 className="posts-heading">Posts</h2>
      <div className="posts">
        {posts.length === 0 && <p className="no-posts">No Posts</p>}
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
    </div>
  );
};

export default ProfilePosts