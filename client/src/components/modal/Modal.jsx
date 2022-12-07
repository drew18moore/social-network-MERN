import React from "react";
import "./modal.css";

export default function Modal({ children, setShowModal }) {
  return (
    <div
      className="modal-backdrop"
      onClick={() => setShowModal((prev) => !prev)}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShowModal((prev) => !prev)}>
          <span class="material-symbols-outlined">close</span>
        </button>
        {children}
      </div>
    </div>
  );
}
