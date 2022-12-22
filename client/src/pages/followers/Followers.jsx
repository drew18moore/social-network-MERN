import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
        <div className="links">
          <Link className="followers-link active-link" to={`/${username}/followers`}>Followers</Link>
          <Link className="following-link" to={`/${username}/following`}>Following</Link>
        </div>
      </div>
      <div className="followed-users">
        {followers.map((user) => {
          return <User key={user._id} user={user} />;
        })}
      </div>
    </div>
  );
}
