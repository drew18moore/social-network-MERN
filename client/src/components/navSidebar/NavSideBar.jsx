import React from "react";
import "./navSidebar.css";

export default function NavSideBar() {
  return (
    <div className="nav-sidebar">
      <nav>
        <ul className="links">
          <li className="selected">
            <span className="material-symbols-rounded">home</span>Home
          </li>
          <li>
            <span className="material-symbols-rounded">person</span>Profile
          </li>
          <li>
            <span className="material-symbols-rounded">settings</span>Settings
          </li>
        </ul>
      </nav>
    </div>
  );
}
