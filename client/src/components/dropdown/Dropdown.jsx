import React, { useRef, useState, useLayoutEffect } from "react";
import "./dropdown.css";

export default function Dropdown({ children, setShowDropdown }) {
  const dropdownRef = useRef();
  const [dropdownStyle, setDropdownStyle] = useState({});

  useLayoutEffect(() => {
    const rect = dropdownRef.current.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      console.log("object");
      setDropdownStyle({
        bottom: "100%",
      });
    } else {
      setDropdownStyle({ 
        top: "100%" 
      });
    }
    console.log(dropdownStyle);
  }, []);

  return (
    <>
      <div ref={dropdownRef} style={dropdownStyle} className="dropdown">
        <span className="arrow"></span>
        {children}
      </div>
      <div
        className="dropdown-backdrop"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown((prev) => !prev);
        }}
      ></div>
    </>
  );
}
