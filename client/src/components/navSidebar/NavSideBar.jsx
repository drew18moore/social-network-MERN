import React from "react";
import "./navSidebar.css";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function NavSideBar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  return (
    <div className="nav-sidebar">
      <nav>
        <ul className="links">
          <li>
            <Link className={location.pathname === "/" ? "selected" : ""} to="/">
              <span className="material-symbols-rounded">home</span>Home
            </Link>
          </li>
          <li>
            <Link className={location.pathname === `/${currentUser.username}` ? "selected": ""} to={`/${currentUser.username}`}>
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
