import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../../components/modal/Modal";
import EditProfile from "../../components/modal/EditProfile";
import Post from "../../components/post/Post";
import "./profile.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { MdArrowBack, MdPhotoCamera } from "react-icons/md";

export default function Profile() {
  const { username } = useParams();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState<any>({});
  const [isFollowing, setIsFollowing] = useState<any>();
  const [followBtnText, setFollowBtnText] = useState("Following");
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState<any>([]);

  const [page, setPage] = useState(1);
  const limit = 20;
  const [isNextPage, setIsNextPage] = useState(true);

  useEffect(() => {
    setPage(1);
    setIsNextPage(true);
    const fetchData = async () => {
      try {
        const [responseUser, responsePosts] = await Promise.all([
          axiosPrivate.get(`/api/users/${username}`),
          axiosPrivate.get(`/api/posts/${username}/all?page=1&limit=${limit}`),
        ]);
        responsePosts.data.numFound < limit
          ? setIsNextPage(false)
          : setIsNextPage(true);
        setUser(responseUser.data);
        setIsFollowing(responseUser.data.isFollowing);
        setPosts(responsePosts.data.posts);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    fetchData();
  }, [username]);

  const loadMorePosts = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/posts/${username}/all?page=${page + 1}&limit=${limit}`
      );
      setPosts((prev: any) => {
        return [...prev, ...response.data.posts];
      });
      response.data.numFound === 0 && setIsNextPage(false);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  const followUser = async () => {
    try {
      const response = await axiosPrivate.put(`/api/users/follow/${username}`, {
        currUsername: currentUser.username,
      });
      setIsFollowing((prev: any) => !prev);
    } catch (err) {
      console.error(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  const deletePostById = (postId: any) => {
    const indexToDelete = posts.findIndex((x: any) => x._id === postId);
    let updatedPosts = [...posts];
    updatedPosts.splice(indexToDelete, 1);
    setPosts(updatedPosts);
  };

  const editPost = (post: any) => {
    const indexToUpdate = posts.findIndex((x: any) => x._id === post._id);
    let updatedPosts = [...posts];
    updatedPosts[indexToUpdate].postBody = post.postBody;
    setPosts(updatedPosts);
  };

  return (
    <div className="profile">
      <div className="profile-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size="1.5rem" />
        </div>
        <p>{user.fullname}</p>
      </div>
      <div className="profile-card">
        <div className="top">
          <div className="profile-img-username">
            <div className="profile-picture-wrapper">
              <img
                className="profile-picture"
                src={user.img || "default-pfp.jpg"}
                alt="Profile Picture"
              />
            </div>
            <div className="profile-name-username">
              <h1 className="name">{user.fullname}</h1>
              <h2 className="username">@{user.username}</h2>
            </div>
          </div>
          {user._id === currentUser._id ? (
            <button
              className="edit-profile-btn"
              onClick={() => setShowEditProfileModal((prev) => !prev)}
            >
              Edit profile
            </button>
          ) : (
            <button
              className={
                isFollowing ? "unfollow-profile-btn" : "follow-profile-btn"
              }
              onClick={followUser}
              onMouseEnter={() => setFollowBtnText("Unfollow")}
              onMouseLeave={() => setFollowBtnText("Following")}
            >
              {isFollowing ? followBtnText : "Follow"}
            </button>
          )}
        </div>
        <div className="middle">
        <h3 className="bio">{user.bio}</h3>
        </div>
        <div className="bottom">
          <span className="following" onClick={() => navigate(`following`)}>
            <span className="count">
              {user.numFollowing}
            </span>{" "}
            Following
          </span>
          <span className="followers" onClick={() => navigate("followers")}>
            <span className="count">
              {user.numFollowers}
            </span>{" "}
            Followers
          </span>
        </div>
      </div>
      <div className="posts-container">
        <h2 className="posts-heading">Posts</h2>
        <div className="posts">
          {posts.length === 0 && <p className="no-posts">No Posts</p>}
          {posts.map((post: any) => (
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
          ))}
          {isNextPage && (
            <button onClick={loadMorePosts} className="load-more-posts">
              Load More
            </button>
          )}
        </div>
      </div>

      {showEditProfileModal && (
        <Modal setShowModal={setShowEditProfileModal}>
          <EditProfile
            setUser={setUser}
            setShowModal={setShowEditProfileModal}
          />
        </Modal>
      )}
    </div>
  );
}
