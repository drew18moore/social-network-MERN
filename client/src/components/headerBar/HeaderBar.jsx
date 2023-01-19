import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "../dropdown/Dropdown";
import AccountDropdown from "../dropdown/AccountDropdown";
import { useAuth } from "../../contexts/AuthContext";
import "./headerBar.css";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser } = useAuth();

  return (
    <header>
      <div className="nav-logo">
        <Link to="/">MERN Social</Link>
      </div>
      <div className="curr-user-wrapper">
        <div
          className="curr-user account-dropdown-btn"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <div className="curr-user-info">
            <p className="fullname">{currentUser.fullname}</p>
            <p className="username">@{currentUser.username}</p>
          </div>
          <img src={currentUser.img || "/default-pfp.jpg"} />
        </div>
        {showDropdown && (
          <Dropdown setShowDropdown={setShowDropdown}>
            <AccountDropdown setShowDropdown={setShowDropdown} />
          </Dropdown>
        )}
      </div>
    </header>
  );
}
