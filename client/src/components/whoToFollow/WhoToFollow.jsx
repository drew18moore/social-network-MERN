import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import api from "../../api/api";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../contexts/AuthContext";
import User from "../user/User";
import "./whoToFollow.css";

const WhoToFollow = () => {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [unfollowedUsers, setUnfollowedUsers] = useState();
  const limit = 4;
  const [isNextPage, setIsNextPage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get(
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
      {isNextPage && <button className="show-more" onClick={() => navigate("/connect")}>Show More</button>}
    </div>
  );
};

export default WhoToFollow;
