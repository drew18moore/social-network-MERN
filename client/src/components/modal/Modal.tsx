import React, { ReactNode, useEffect } from "react";
import "./modal.css";
import { MdOutlineClose } from "react-icons/md";

type Props = {
  children: ReactNode;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function Modal({ children, setShowModal }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        e.stopPropagation();
        setShowModal((prev) => !prev);
      }}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-modal-btn"
          onClick={() => setShowModal((prev) => !prev)}
        >
          <MdOutlineClose size="1.5rem" />
        </button>
        {children}
      </div>
    </div>
  );
}
