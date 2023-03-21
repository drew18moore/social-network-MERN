import React, { useState, useEffect, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./user.css";

const User = forwardRef(({ user }, ref) => {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [isFollowing, setIsFollowing] = useState();
  const [followBtnText, setFollowBtnText] = useState("Following");

  const navigate = useNavigate();

  useEffect(() => {
    const following = user?.isFollowing;
    setIsFollowing(following);
  }, []);

  const followUser = async (e) => {
    e.stopPropagation();
    try {
      await axiosPrivate.put(`/api/users/follow/${user.username}`, {
        currUsername: currentUser.username,
      });
      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div ref={ref} className="user">
      <div className="user-info">
        <img
          src={user.img}
          alt="User Profile Picture"
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
)

export default User;