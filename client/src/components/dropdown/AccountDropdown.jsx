import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { axiosPrivate } from "../../api/api";

export default function AccountDropdown({ setShowDropdown }) {
  const { currentUser, setCurrentUser } = useAuth()

  const logout = async () => {
    setCurrentUser({})
    try {
      await axiosPrivate.get("/api/logout")
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <ul className="account-dropdown">
      <li onClick={() => setShowDropdown((prev) => !prev)}>
        <Link to={`/${currentUser.username}`}>
          <span className="material-symbols-rounded">person</span>
          <p>Profile</p>
        </Link>
      </li>
      <li onClick={logout}>
        <Link to="/login">
          <span className="material-symbols-rounded">logout</span>
          <p>Log Out</p>
        </Link>
      </li>
    </ul>
  );
}
