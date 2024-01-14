import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./settings.css";
import Modal from "../../components/modal/Modal";
import DeleteAccount from "../../components/modal/DeleteAccount";
import { useTheme } from "../../contexts/ThemeContext";
import { MdArrowBack, MdOutlineLogout } from "react-icons/md";
import useLogout from "../../hooks/auth/useLogout";

const Settings = () => {
  const [showModal, setShowModal] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigate = useNavigate();
  const logout = useLogout();
  return (
    <div className="settings-page">
      <div className="settings-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size="1.5rem" />
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
            <button onClick={logout}>
              <Link to="/login">
                <MdOutlineLogout size="1.5rem" />
                Logout
              </Link>
            </button>
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
