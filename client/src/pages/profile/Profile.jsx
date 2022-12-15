import React from "react";
import Navbar from "../../components/navbar/Navbar";
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
  const { username } = useParams()
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangeProfilePictureModal, setShowChangeProfilePictureModal] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get(`http://192.168.1.2:3000/api/users/${username}`).then((res) => {
      setUser(res.data)
      console.log(res.data);
    }).catch((err) => {
      console.log("Error", err)
    })
  }, [])
  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-img-username">
            <div className="profile-picture-wrapper">
              <img
                className="profile-picture"
                // src="/default-pfp.jpg"
                src={user.img || "default-pfp.jpg"}
                alt="profile picture"
              />
              <div className="change-profile-picture-btn" onClick={() => setShowChangeProfilePictureModal((prev) => !prev)}>
                <span className="material-symbols-rounded">photo_camera</span>
              </div>
            </div>
            <div className="profile-name-username">
              <h1 className="name">{user.fullname}</h1>
              <h2 className="username">@{user.username}</h2>
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
      {showChangeProfilePictureModal && <Modal setShowModal={setShowChangeProfilePictureModal}><ChangeProfilePicture setShowModal={setShowChangeProfilePictureModal} /></Modal>}
    </>
  );
}
