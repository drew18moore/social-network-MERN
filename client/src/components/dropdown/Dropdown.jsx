import React from "react";
import "./dropdown.css";

export default function Dropdown({ children, setShowDropdown }) {
  return (
    <>
      <div className="dropdown">{children}</div>
      <div
        className="dropdown-backdrop"
        onClick={() => setShowDropdown(prev => !prev)}
      ></div>
    </>
  );
}
