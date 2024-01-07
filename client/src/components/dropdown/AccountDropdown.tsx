import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { MdOutlineLogout, MdPersonOutline } from "react-icons/md";
import useLogout from "../../hooks/auth/useLogout";

type Props = {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function AccountDropdown({ setShowDropdown }: Props) {
  const { currentUser } = useAuth();
  const logout = useLogout();
  return (
    <ul className="account-dropdown">
      <li onClick={() => setShowDropdown((prev) => !prev)}>
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
