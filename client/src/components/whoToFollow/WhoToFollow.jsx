import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import User from "../user/User";
import "./whoToFollow.css";

const WhoToFollow = () => {
  const { currentUser } = useAuth();
  const [unfollowedUsers, setUnfollowedUsers] = useState();
  const limit = 4;
  const [isNextPage, setIsNextPage] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/api/users/all-unfollowed/${currentUser._id}?page=1&limit=${limit}`
        );
        setUnfollowedUsers(response.data.unfollowedUsers);
        response.data.numFound < limit ? setIsNextPage(false) : setIsNextPage(true);
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
      {isNextPage && <button className="show-more">Show More</button>}
    </div>
  );
};

export default WhoToFollow;
