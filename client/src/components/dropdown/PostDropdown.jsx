import React from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function PostDropdown({ username, setShowDropdown, setShowDeletePostModal }) {
  const { currentUser } = useAuth();

  return (
    <ul className="post-dropdown">
      {username === currentUser.username && (
        <li>
          <span className="material-symbols-rounded">edit</span>
          <p>Edit</p>
        </li>
      )}
      {username === currentUser.username && (
        <li
          onClick={() => {
            setShowDropdown(false);
            setShowDeletePostModal((prev) => !prev);
          }}
        >
          <span className="material-symbols-rounded">delete</span>
          <p>Delete</p>
        </li>
      )}
      {username !== currentUser.username && (
        <li>
          <span className="material-symbols-rounded">report</span>
          <p>Report</p>
        </li>
      )}
    </ul>
  );
}
