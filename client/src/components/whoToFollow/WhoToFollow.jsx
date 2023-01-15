import React, { useEffect, useState } from "react";
import "./whoToFollow.css";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import User from "../user/User";

const WhoToFollow = () => {
  const { currentUser } = useAuth();
  const [unfollowedUsers, setUnfollowedUsers] = useState();

  useEffect(() => {
    api.get(`/api/users/all-unfollowed/${currentUser._id}`).then((res) => {
      setUnfollowedUsers(res.data);
    });
  }, []);

  return (
    <div className="who-to-follow">
      <h2>Who to follow?</h2>
      {unfollowedUsers &&
        unfollowedUsers.map((user) => {
          return <User user={user} key={user._id} />;
        })}
    </div>
  );
};

export default WhoToFollow;
