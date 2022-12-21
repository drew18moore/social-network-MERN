import React from "react";
import "./profile.css";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import EditProfile from "../../components/modal/EditProfile";
import ChangeProfilePicture from "../../components/modal/ChangeProfilePicture";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Post from "../../components/post/Post";

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

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user data
      await axios
        .get(`http://192.168.1.2:3000/api/users/${username}`)
        .then((res) => {
          setUser(res.data);
          setIsFollowing(() => res.data.followers.includes(currentUser._id));
        })
        .catch((err) => {
          console.log("Error", err);
        });
      // Fetch user posts
      await axios
        .get(`http://192.168.1.2:3000/api/posts/${username}`)
        .then((res) => {
          setPosts(res.data);
        });
    };
    fetchData();
  }, [username]);

  const followUser = () => {
    axios
      .put(`http://192.168.1.2:3000/api/users/follow/${username}`, {
        currUsername: currentUser.username,
      })
      .then((res) => {
        setIsFollowing((prev) => !prev);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("Error", err);
      });
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
    <div className="profile-main">
      <div className="profile-container">
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
                    <span className="material-symbols-rounded">
                      photo_camera
                    </span>
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
            <span className="followers">
              <span className="count">
                {user.followers && user.followers.length}
              </span>{" "}
              Followers
            </span>
          </div>
        </div>
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
            />
          ))}
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
