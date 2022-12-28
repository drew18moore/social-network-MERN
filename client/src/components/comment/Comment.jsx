import React from "react";
import "./comment.css";
import { useState } from "react";
import Dropdown from "../dropdown/Dropdown";
import PostDropdown from "../dropdown/PostDropdown";

export default function Comment({ fullname, username, profilePicture, commentBody }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="comment">
      <div className="comment-pfp">
        <img src={profilePicture} alt="" />
      </div>
      <div className="comment-text">
        <div className="comment-top">
          <p className="fullname">{fullname}</p>
          <div className="comment-dropdown-wrapper">
            <div className="meatball-btn" onClick={() => setShowDropdown(true)}>
              <span className="material-symbols-outlined">more_horiz</span>
            </div>
            {showDropdown && (
              <Dropdown setShowDropdown={setShowDropdown}>
                <PostDropdown 
                  username={username}
                  setShowDropdown={setShowDropdown}
                  
                />
              </Dropdown>
            )}
          </div>
        </div>

        <p className="comment-body">{commentBody}</p>
      </div>
    </div>
  );
}
