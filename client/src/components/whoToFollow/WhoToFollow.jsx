import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import User from "../user/User";
import "./whoToFollow.css";

const WhoToFollow = () => {
  const { currentUser } = useAuth();
  const [unfollowedUsers, setUnfollowedUsers] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/api/users/all-unfollowed/${currentUser._id}`
        );
        setUnfollowedUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
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
