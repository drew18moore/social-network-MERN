import React, { useRef, useState, useLayoutEffect, ReactNode } from "react";
import "./dropdown.css";

type Props = {
  children: ReactNode;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function Dropdown({ children, setShowDropdown }: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    const rect = dropdownRef.current!.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      setDropdownStyle({
        bottom: "100%",
      });
    } else {
      setDropdownStyle({
        top: "100%",
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
          setShowDropdown((prev) => !prev);
        }}
      ></div>
    </>
  );
}
