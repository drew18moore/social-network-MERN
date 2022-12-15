import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AccountDropdown({ setShowDropdown }) {
  const { currentUser } = useAuth()
  return (
    <ul className="account-dropdown">
      <li onClick={() => setShowDropdown((prev) => !prev)}>
        <Link to={`/${currentUser.username}`}>
          <span className="material-symbols-rounded">person</span>
          <p>Profile</p>
        </Link>
      </li>
      <li>
        <Link to="/login">
          <span className="material-symbols-rounded">logout</span>
          <p>Log Out</p>
        </Link>
      </li>
    </ul>
  );
}
