import api from "../../api/api";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import User from "../../components/user/User";
import "./followersFollowing.css"

export default function FollowersFollowing({ page }) {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();
  const [currPage, setCurrPage] = useState(page);

  useEffect(() => {
    const fetchFollowers = () => {
      api
        .get(`/api/users/${username}/followers`)
        .then((res) => {
          setUser(res.data.user);
          setFollowers(res.data.followers);
        })
        .catch((err) => {
          console.log("Error", err);
        });
    };

    const fetchFollowing = () => {
      api
        .get(`/api/users/${username}/following`)
        .then((res) => {
          setFollowing(res.data.following);
        })
        .catch((err) => {
          console.log("Error", err);
        });
    };
    fetchFollowers();
    fetchFollowing();
  }, [username]);

  return (
    <>
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
          <div
            className={`followers-link ${
              currPage === "followers" && "active-link"
            }`}
            onClick={() => setCurrPage("followers")}
          >
            Followers
          </div>
          <div
            className={`following-link ${
              currPage === "following" && "active-link"
            }`}
            onClick={() => setCurrPage("following")}
          >
            Following
          </div>
        </div>
      </div>
      <div className="followed-users">
        {currPage === "followers" &&
          followers.map((user) => {
            return <User key={user._id} user={user} />;
          })}
        {currPage === "following" &&
          following.map((user) => {
            return <User key={user._id} user={user} />;
          })}
      </div>
    </>
  );
}
