import React from "react";
import "./modal.css";

export default function Modal({ children, setShowModal }) {
  return (
    <div
      className="modal-backdrop"
      onClick={() => setShowModal((prev) => !prev)}
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
