import React from "react";
import "./dropdown.css";

export default function Dropdown({ children, setShowdropdown }) {
  return (
    <>
      <div className="dropdown">{children}</div>
      <div
        className="dropdown-backdrop"
        onClick={() => setShowdropdown(false)}
      ></div>
    </>
  );
}
