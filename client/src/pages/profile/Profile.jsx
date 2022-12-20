import React from "react";
import "./profile.css";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import EditProfile from "../../components/modal/EditProfile";
import ChangeProfilePicture from "../../components/modal/ChangeProfilePicture";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const { username } = useParams();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangeProfilePictureModal, setShowChangeProfilePictureModal] =
    useState(false);
  const { currentUser } = useAuth();
  const [user, setUser] = useState({});
  const [isFollowing, setIsFollowing] = useState();
  const [followBtnText, setFollowBtnText] = useState("Following");

  useEffect(() => {
    axios
      .get(`http://192.168.1.2:3000/api/users/${username}`)
      .then((res) => {
        setUser(res.data);
        setIsFollowing(() => res.data.followers.includes(currentUser._id));
      })
      .catch((err) => {
        console.log("Error", err);
      });
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
            <span className="following"><span className="count">{user.following && user.following.length}</span> Following</span>
            <span className="followers"><span className="count">{user.followers && user.followers.length}</span> Followers</span>
          </div>
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
