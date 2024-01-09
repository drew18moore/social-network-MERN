import { useParams } from "react-router-dom";
import useGetFollowing from "../../../hooks/users/useGetFollowing";
import User from "../../../components/user/User";

export default function FollowingList() {
  const { username } = useParams();
  const { following, isLoading, lastUserRef } = useGetFollowing({
    username: username!,
  });
  return (
    <>
      {following.map((user, index) => {
        if (following.length - 1 === index) {
          return <User key={user._id} user={user} ref={lastUserRef} />;
        } else {
          return <User key={user._id} user={user} ref={lastUserRef} />;
        }
      })}
    </>
  );
}
