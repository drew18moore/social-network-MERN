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
              <span className="material-symbols-rounded">home</span><p className="link-txt">Home</p>
            </Link>
          </li>
          <li>
            <Link className={location.pathname === `/${currentUser.username}` ? "selected": ""} to={`/${currentUser.username}`}>
              <span className="material-symbols-rounded">person</span><p className="link-txt">Profile</p>
            </Link>
          </li>
          <li>
            <Link>
              <span className="material-symbols-rounded">settings</span><p className="link-txt">Settings</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
