import React from "react";
import { Link } from "react-router-dom";

export default function AccountDropdown({ setShowDropdown }) {
  return (
    <ul className="account-dropdown">
      <li onClick={() => setShowDropdown((prev) => !prev)}>
        <Link to="/profile">
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
