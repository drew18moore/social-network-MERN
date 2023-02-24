import React, { useState } from "react";
import "./navSidebar.css";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Dropdown from "../dropdown/Dropdown";
import AccountDropdown from "../dropdown/AccountDropdown";

export default function NavSideBar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="nav-sidebar">
      <nav>
        <ul className="links">
          <li>
            <Link
              className={location.pathname === "/" ? "selected" : ""}
              to="/"
            >
              <span className="material-symbols-rounded">home</span>
              <p className="link-txt">Home</p>
            </Link>
          </li>
          <li>
            <Link
              className={location.pathname === "/connect" ? "selected" : ""}
              to="/connect"
            >
              <span className="material-symbols-rounded">group</span>
              <p className="link-txt">Connect</p>
            </Link>
          </li>
          <li>
            <Link
              className={location.pathname === "/bookmarks" ? "selected" : ""}
              to="/bookmarks"
            >
              <span className="material-symbols-rounded">bookmark</span>
              <p className="link-txt">Bookmarks</p>
            </Link>
          </li>
          <li>
            <Link
              className={
                location.pathname === `/${currentUser.username}`
                  ? "selected"
                  : ""
              }
              to={`/${currentUser.username}`}
            >
              <span className="material-symbols-rounded">person</span>
              <p className="link-txt">Profile</p>
            </Link>
          </li>
          <li>
            <Link
              className={location.pathname === "/settings" ? "selected" : ""}
              to="/settings"
            >
              <span className="material-symbols-rounded">settings</span>
              <p className="link-txt">Settings</p>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="curr-user-wrapper">
        <div
          className="curr-user account-dropdown-btn"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <img src={currentUser.img || "/default-pfp.jpg"} />
          <div className="curr-user-info">
            <p className="fullname">{currentUser.fullname}</p>
            <p className="username">@{currentUser.username}</p>
          </div>
        </div>
        {showDropdown && (
          <Dropdown setShowDropdown={setShowDropdown}>
            <AccountDropdown setShowDropdown={setShowDropdown} />
          </Dropdown>
        )}
      </div>
    </div>
  );
}
