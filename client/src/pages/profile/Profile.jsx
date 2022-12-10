import React from "react";
import Navbar from "../../components/navbar/Navbar";
import "./profile.css";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import EditProfile from "../../components/modal/EditProfile";

export default function Profile() {
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
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
              <div className="change-profile-picture-btn">
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
            onClick={() => setShowModal((prev) => !prev)}
          >
            Edit profile
          </button>
        </div>
      </div>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <EditProfile setShowModal={setShowModal} />
        </Modal>
      )}
    </>
  );
}
