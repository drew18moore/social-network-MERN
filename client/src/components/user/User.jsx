import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import "./user.css";

export default function User({ user }) {
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState();
  const [followBtnText, setFollowBtnText] = useState("Following");

  const navigate = useNavigate();

  useEffect(() => {
    const following = user.followers.includes(currentUser._id);
    setIsFollowing(following);
  }, []);

  const followUser = async (e) => {
    e.stopPropagation();
    try {
      await api.put(`/api/users/follow/${user.username}`, {
        currUsername: currentUser.username,
      });
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="user">
      <div className="user-info">
        <img
          src={user.img}
          alt="user profile picture"
          onClick={() => navigate(`/${user.username}`)}
        />
        <div className="info">
          <p className="fullname" onClick={() => navigate(`/${user.username}`)}>
            {user.fullname}
          </p>
          <p className="username">@{user.username}</p>
        </div>
      </div>
      {user._id !== currentUser._id && (
        <button
          className={isFollowing ? "unfollow-user-btn" : "follow-user-btn"}
          onMouseEnter={() => setFollowBtnText("Unfollow")}
          onMouseLeave={() => setFollowBtnText("Following")}
          onClick={followUser}
        >
          {isFollowing ? followBtnText : "Follow"}
        </button>
      )}
    </div>
  );
}
