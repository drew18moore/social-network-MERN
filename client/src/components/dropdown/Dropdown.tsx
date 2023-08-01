import React, { useRef, useState, useLayoutEffect } from "react";
import "./dropdown.css";

export default function Dropdown({ children, setShowDropdown }: any) {
  const dropdownRef = useRef<any>();
  const [dropdownStyle, setDropdownStyle] = useState({});

  useLayoutEffect(() => {
    const rect = dropdownRef.current.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      setDropdownStyle({
        bottom: "100%",
      });
    } else {
      setDropdownStyle({ 
        top: "100%" 
      });
    }
  }, []);

  return (
    <>
      <div ref={dropdownRef} style={dropdownStyle} className="dropdown">
        {children}
      </div>
      <div
        className="dropdown-backdrop"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown((prev: any) => !prev);
        }}
      ></div>
    </>
  );
}
