import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./following.css";
import axios from "axios";

export default function Following() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      axios
        .get(`http://192.168.1.2:3000/api/users/${username}`)
        .then((res) => {
          setUser(res.data);
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
        <div className="back-btn" onClick={() => navigate(`/${user.username}`)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <div className="user-info">
          <p>{user.fullname}</p>
          <p className="username">@{user.username}</p>
        </div>
      </div>
    </div>
  );
}
