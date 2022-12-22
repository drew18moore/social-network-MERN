import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./following.css";
import axios from "axios";
import User from "../../components/user/User";

export default function Following() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [followedUsers, setFollowedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      axios
        .get(`http://192.168.1.2:3000/api/users/${username}/following`)
        .then((res) => {
          setUser(res.data.user);
          setFollowedUsers(res.data.followedUsers);
        })
        .catch((err) => {
          console.log("Error", err);
        });
    };
    fetchUser();
  }, [username]);
  return (
    <div className="profile-main">
      <div className="header">
        <div className="top">
          <div
            className="back-btn"
            onClick={() => navigate(`/${user.username}`)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </div>
          <div className="following-user-info">
            <p>{user.fullname}</p>
            <p className="username">@{user.username}</p>
          </div>
        </div>
        <h3>Following</h3>
      </div>
      <div className="followed-users">
        {followedUsers.map((user) => {
          return <User key={user._id} user={user} />;
        })}
      </div>
    </div>
  );
}
