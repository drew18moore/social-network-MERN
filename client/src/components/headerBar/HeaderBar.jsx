import React, { useState } from "react";
import "./headerBar.css";
import { Link } from "react-router-dom";
import Dropdown from "../dropdown/Dropdown";
import AccountDropdown from "../dropdown/AccountDropdown";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser } = useAuth();

  const openDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  return (
    <header>
      <nav>
        <div className="nav-logo">
          <Link to="/">MERN Social</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="account-dropdown-li">
            <div className="account-dropdown-btn" onClick={openDropdown}>
              <img src={currentUser.img || "default-pfp.jpg"} />
            </div>
            {showDropdown && (
              <Dropdown setShowDropdown={setShowDropdown}>
                <AccountDropdown setShowDropdown={setShowDropdown} />
              </Dropdown>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
