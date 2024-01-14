import { useOutletContext, useParams } from "react-router-dom";
import useGetFollowing from "../../../hooks/users/useGetFollowing";
import User from "../../../components/user/User";
import { useEffect } from "react";

export default function FollowingList() {
  const [setUser] = useOutletContext<any>();
  const { username } = useParams();
  const { following, isLoading, lastUserRef, user } = useGetFollowing({
    username: username!,
  });

  useEffect(() => {
    setUser(user);
  }, [user]);
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
