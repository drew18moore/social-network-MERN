import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { MdOutlineReport, MdOutlineEdit, MdOutlineDeleteForever } from "react-icons/md";

export default function PostDropdown({
  username,
  setShowDropdown,
  setShowDeletePostModal,
  setShowEditPostModal,
}: any) {
  const { currentUser } = useAuth();

  return (
    <ul className="post-dropdown">
      {username === currentUser.username && (
        <li
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(false);
            setShowEditPostModal(true);
          }}
        >
          <MdOutlineEdit size="1.5rem" />
          <p>Edit</p>
        </li>
      )}
      {username === currentUser.username && (
        <li
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(false);
            setShowDeletePostModal((prev: any) => !prev);
          }}
        >
          <MdOutlineDeleteForever size="1.5rem"/>
          <p>Delete</p>
        </li>
      )}
      {username !== currentUser.username && (
        <li
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MdOutlineReport size="1.5rem" />
          <p>Report</p>
        </li>
      )}
    </ul>
  );
}
