import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import User from "../../components/user/User";

export default function Followers() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      axios
        .get(`http://192.168.1.2:3000/api/users/${username}/followers`)
        .then((res) => {
          setUser(res.data.user);
          setFollowers(res.data.followers);
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
        <h3>Followers</h3>
      </div>
      <div className="followed-users">
        {followers.map((user) => {
          return <User key={user._id} user={user} />;
        })}
      </div>
    </div>
  );
}
