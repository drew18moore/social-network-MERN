import React from "react";
import { useEffect } from "react";
import "./modal.css";

export default function Modal({ children, setShowModal }) {

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "visible"
    }
  }, [])

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        e.stopPropagation();
        setShowModal((prev) => !prev)
      }}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={() => setShowModal((prev) => !prev)}>
          <span className="material-symbols-outlined">close</span>
        </button>
        {children}
      </div>
    </div>
  );
}
