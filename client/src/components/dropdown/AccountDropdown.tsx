import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { axiosPrivate } from "../../api/api";
import { MdOutlineLogout, MdPersonOutline } from "react-icons/md";

export default function AccountDropdown({ setShowDropdown }: any) {
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
      <li onClick={() => setShowDropdown((prev: any) => !prev)}>
        <Link to={`/${currentUser.username}`}>
          <MdPersonOutline size="1.5rem" />
          <p>Profile</p>
        </Link>
      </li>
      <li onClick={logout}>
        <Link to="/login">
          <MdOutlineLogout size="1.5rem" />
          <p>Log Out</p>
        </Link>
      </li>
    </ul>
  );
}
