import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../../components/modal/Modal";
import EditProfile from "../../components/modal/EditProfile";
import ChangeProfilePicture from "../../components/modal/ChangeProfilePicture";
import Post from "../../components/post/Post";
import "./profile.css";

export default function Profile() {
  const { username } = useParams();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangeProfilePictureModal, setShowChangeProfilePictureModal] =
    useState(false);
  const { currentUser } = useAuth();
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState();
  const [followBtnText, setFollowBtnText] = useState("Following");
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  const [page, setPage] = useState(1);
  const limit = 20;
  const [isNextPage, setIsNextPage] = useState(true);

  useEffect(() => {
    setPage(1);
    setIsNextPage(true);
    const fetchData = async () => {
      try {
        const [responseUser, responsePosts] = await Promise.all([
          api.get(`/api/users/${username}`),
          api.get(`/api/posts/${username}/all?page=1&limit=${limit}`),
        ]);
        responsePosts.data.numFound < limit ? setIsNextPage(false) : setIsNextPage(true);
        setUser(responseUser.data);
        setIsFollowing(() =>
          responseUser.data.followers.includes(currentUser._id)
        );
        setPosts(responsePosts.data.posts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [username]);

  const loadMorePosts = async () => {
    try {
      const response = await api.get(
        `/api/posts/${username}/all?page=${page + 1}&limit=${limit}`
      );
      setPosts((prev) => {
        return [...prev, ...response.data.posts];
      });
      response.data.numFound === 0 && setIsNextPage(false);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const followUser = async () => {
    try {
      const response = await api.put(`/api/users/follow/${username}`, {
        currUsername: currentUser.username,
      });
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePostById = (postId) => {
    const indexToDelete = posts.findIndex((x) => x._id === postId);
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
    <div className="profile">
      <div className="profile-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
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
                alt="profile picture"
              />
              {user._id === currentUser._id && (
                <div
                  className="change-profile-picture-btn"
                  onClick={() =>
                    setShowChangeProfilePictureModal((prev) => !prev)
                  }
                >
                  <span className="material-symbols-rounded">photo_camera</span>
                </div>
              )}
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
        <div className="bottom">
          <span className="following" onClick={() => navigate(`following`)}>
            <span className="count">
              {user.following && user.following.length}
            </span>{" "}
            Following
          </span>
          <span className="followers" onClick={() => navigate("followers")}>
            <span className="count">
              {user.followers && user.followers.length}
            </span>{" "}
            Followers
          </span>
        </div>
      </div>
      <div className="posts-container">
        <h2 className="posts-heading">Posts</h2>
        <div className="posts">
          {posts.map((post) => (
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
      {showChangeProfilePictureModal && (
        <Modal setShowModal={setShowChangeProfilePictureModal}>
          <ChangeProfilePicture
            setShowModal={setShowChangeProfilePictureModal}
          />
        </Modal>
      )}
    </div>
  );
}
