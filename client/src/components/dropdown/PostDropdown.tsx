import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { MdOutlineReport, MdOutlineEdit, MdOutlineDeleteForever } from "react-icons/md";

type Props = {
  username: string
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>
  setShowDeletePostModal: React.Dispatch<React.SetStateAction<boolean>>
  setShowEditPostModal: React.Dispatch<React.SetStateAction<boolean>>
}
export default function PostDropdown({
  username,
  setShowDropdown,
  setShowDeletePostModal,
  setShowEditPostModal,
}: Props) {
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
            setShowDeletePostModal((prev) => !prev);
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
