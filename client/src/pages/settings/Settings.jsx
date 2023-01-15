import React from "react";
import { useNavigate } from "react-router-dom";
import "./settings.css"

const Settings = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="settings-top">
        <div className="back-btn" onClick={() => navigate("/")}>
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <p>Settings</p>
      </div>
      <div className="settings-container">
        <div className="appearance">
          <h2>Appearance</h2>
        </div>
        <div className="delete-account">
          <h2>Delete Account</h2>
          <hr />
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button>Delete your account</button>
        </div>
      </div>
    </>
  );
};

export default Settings;
