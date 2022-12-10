import React from "react";
import Navbar from "../../components/navbar/Navbar";
import "./profile.css";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import EditProfile from "../../components/modal/EditProfile";
import ChangeProfilePicture from "../../components/modal/ChangeProfilePicture";

export default function Profile() {
  const { currentUser } = useAuth();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangeProfilePictureModal, setShowChangeProfilePictureModal] = useState(false);
  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-img-username">
            <div className="profile-picture-wrapper">
              <img
                className="profile-picture"
                src="/default-pfp.jpg"
                alt="profile picture"
              />
              <div className="change-profile-picture-btn" onClick={() => setShowChangeProfilePictureModal((prev) => !prev)}>
                <span className="material-symbols-rounded">photo_camera</span>
              </div>
            </div>
            <div className="profile-name-username">
              <h1 className="name">{currentUser.fullname}</h1>
              <h2 className="username">@{currentUser.username}</h2>
            </div>
          </div>
          <button
            className="edit-profile-btn"
            onClick={() => setShowEditProfileModal((prev) => !prev)}
          >
            Edit profile
          </button>
        </div>
      </div>
      {showEditProfileModal && (
        <Modal setShowModal={setShowEditProfileModal}>
          <EditProfile setShowModal={setShowEditProfileModal} />
        </Modal>
      )}
      {showChangeProfilePictureModal && <Modal setShowModal={setShowChangeProfilePictureModal}><ChangeProfilePicture /></Modal>}
    </>
  );
}
