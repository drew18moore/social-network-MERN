import { useNavigate } from "react-router-dom";
import User from "../user/User";
import { UserSkeleton } from "../loading/SkeletonLoading";
import "./whoToFollow.css";
import useGetUnfollowedUsers from "../../hooks/users/useGetUnfollowedUsers";

const WhoToFollow = () => {
  const navigate = useNavigate();

  const { unfollowedUsers, isLoading, isNextPage } = useGetUnfollowedUsers({
    limit: 4,
  });

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
      {isLoading && (
        <div className="whotofollow-skeleton-container">{skeletons()}</div>
      )}
      {isNextPage && (
        <button className="show-more" onClick={() => navigate("/connect")}>
          Show More
        </button>
      )}
    </div>
  );
};

export default WhoToFollow;
