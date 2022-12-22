import React from "react";
import "./user.css";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function User({ user }) {
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBtnText, setFollowBtnText] = useState("Following");

  const navigate = useNavigate();

  useEffect(() => {
    const following = currentUser.following.includes(user._id)
    setIsFollowing(following);
  },[])
  
  const followUser = (e) => {
    e.stopPropagation();
    axios
      .put(`http://192.168.1.2:3000/api/users/follow/${user.username}`, {
        currUsername: currentUser.username,
      })
      .then((res) => {
        setIsFollowing((prev) => !prev);
        console.log(res.data);
      });
  };
  return (
    <div className="user">
      <div className="user-info">
        <img src={user.img} alt="user profile picture" onClick={() => navigate(`/${user.username}`)}/>
        <div className="info">
          <p className="fullname" onClick={() => navigate(`/${user.username}`)}>{user.fullname}</p>
          <p className="username">@{user.username}</p>
        </div>
      </div>
      <button
        className={isFollowing ? "unfollow-user-btn" : "follow-user-btn"}
        onMouseEnter={() => setFollowBtnText("Unfollow")}
        onMouseLeave={() => setFollowBtnText("Following")}
        onClick={followUser}
      >
        {isFollowing ? followBtnText : "Follow"}
      </button>
    </div>
  );
}
