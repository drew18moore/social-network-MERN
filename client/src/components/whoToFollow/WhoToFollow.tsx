import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useAuth } from "../../contexts/AuthContext";
import User from "../user/User";
import { UserSkeleton } from "../loading/SkeletonLoading";
import "./whoToFollow.css";

const WhoToFollow = () => {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [unfollowedUsers, setUnfollowedUsers] = useState<UnfollowedUser[]>();
  const [isLoading, setIsLoading] = useState(false);
  const limit = 4;
  const [isNextPage, setIsNextPage] = useState<boolean>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(
          `/api/users/all-unfollowed/${currentUser._id}?page=1&limit=${limit}`
        );
        setUnfollowedUsers(response.data.unfollowedUsers);
        response.data.numFound < limit ? setIsNextPage(false) : setIsNextPage(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const skeletons = () => {
    let arr = [];
    for (let i = 0; i < 4; i++) {
      arr.push(<UserSkeleton key={i} />);
    }

    return <>{arr}</>;
  };

  return (
    <div className="who-to-follow">
      <h2>Who to follow?</h2>
      {unfollowedUsers &&
        unfollowedUsers.map((user) => {
          return <User user={user} key={user._id} />;
        })}
      {isLoading && <div className="whotofollow-skeleton-container">{skeletons()}</div>}
      {isNextPage && <button className="show-more" onClick={() => navigate("/connect")}>Show More</button>}
    </div>
  );
};

export default WhoToFollow;
