import { useParams } from "react-router-dom";
import useGetFollowers from "../../../hooks/users/useGetFollowers";
import User from "../../../components/user/User";

export default function FollowersList() {
  const { username } = useParams();
  const { followers, isLoading, lastUserRef } = useGetFollowers({
    username: username!,
  });
  return (
    <>
      {followers.map((user, index) => {
        if (followers.length - 1 === index) {
          return <User key={user._id} user={user} ref={lastUserRef} />;
        } else {
          return <User key={user._id} user={user} />;
        }
      })}
    </>
  );
}
