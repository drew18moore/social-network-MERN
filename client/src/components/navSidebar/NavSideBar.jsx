import React from "react";
import "./navSidebar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function NavSideBar() {
  const { currentUser } = useAuth();

  return (
    <div className="nav-sidebar">
      <nav>
        <ul className="links">
          <li>
            <Link className="selected" to="/">
              <span className="material-symbols-rounded">home</span>Home
            </Link>
          </li>
          <li>
            <Link to={`/${currentUser.username}`}>
              <span className="material-symbols-rounded">person</span>Profile
            </Link>
          </li>
          <li>
            <Link>
              <span className="material-symbols-rounded">settings</span>Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
