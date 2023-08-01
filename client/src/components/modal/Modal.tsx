import React, { useEffect } from "react";
import "./modal.css";
import { MdOutlineClose } from "react-icons/md";

export default function Modal({ children, setShowModal }: any) {

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
        setShowModal((prev: any) => !prev)
      }}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={() => setShowModal((prev: any) => !prev)}>
          <MdOutlineClose size="1.5rem" />
        </button>
        {children}
      </div>
    </div>
  );
}
