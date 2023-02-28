import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./settings.css";
import Modal from "../../components/modal/Modal";
import DeleteAccount from "../../components/modal/DeleteAccount";
import { useTheme } from "../../contexts/ThemeContext";

const Settings = () => {
  const [showModal, setShowModal] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();
  return (
    <div className="settings-page">
      <div className="settings-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <p>Settings</p>
      </div>
      <div className="settings-container">
        <div className="appearance">
          <h2>Appearance</h2>
          <hr />
          <div className="appearance-options">
            <div className="theme">
              <h3>Theme</h3>
              <div className="themes">
                <input
                  type="radio"
                  onChange={(e) => setTheme(e.target.value)}
                  name="theme"
                  id="light"
                  value="light"
                  checked={theme === "light"}
                />
                <label htmlFor="light">Light</label>
                <input
                  type="radio"
                  onChange={(e) => setTheme(e.target.value)}
                  name="theme"
                  id="dark"
                  value="dark"
                  checked={theme === "dark"}
                />
                <label htmlFor="dark">Dark</label>
              </div>
            </div>
          </div>
        </div>
        <div className="account">
          <h2>Account</h2>
          <hr />
          <div className="logout">
            <button className=""><span className="material-symbols-rounded">logout</span>Logout</button>
          </div>
          <div className="delete-account">
            <button onClick={() => setShowModal(true)}>
              Delete your account
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <DeleteAccount />
        </Modal>
      )}
    </div>
  );
};

export default Settings;
