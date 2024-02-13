import { useNavigate } from "react-router-dom";
import User from "../../components/user/User";
import "./connect.css";
import { MdArrowBack } from "react-icons/md";
import { UserSkeleton } from "../../components/loading/SkeletonLoading";
import useGetUnfollowedUsers from "../../hooks/users/useGetUnfollowedUsers";

const Connect = () => {
  const navigate = useNavigate();
  const { unfollowedUsers, lastUserRef, isLoading } = useGetUnfollowedUsers({
    limit: 20,
  });

  const skeletons = () => {
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(<UserSkeleton key={i} />);
    }

    return <>{arr}</>;
  };

  return (
    <div className="connect-page">
      <div className="connect-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size="1.5rem" />
        </div>
        <p>Connect</p>
      </div>
      <div className="unfollowed-users-container">
        <h1 className="connect-h1">People you may know</h1>
        {unfollowedUsers.length !== 0 && (
          <div className="unfollowed-users">
            {unfollowedUsers &&
              unfollowedUsers.map((user, index) => {
                if (unfollowedUsers.length - 1 === index) {
                  return <User ref={lastUserRef} user={user} key={user._id} />;
                }
                return <User user={user} key={user._id} />;
              })}
          </div>
        )}
        {isLoading && (
          <div className="user-skeleton-container">{skeletons()}</div>
        )}
      </div>
    </div>
  );
};

export default Connect;
