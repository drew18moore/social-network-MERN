import { useOutletContext, useParams } from "react-router-dom";
import useGetFollowers from "../../../hooks/users/useGetFollowers";
import User from "../../../components/user/User";
import { useEffect } from "react";

export default function FollowersList() {
  const [setUser] = useOutletContext<any>();
  const { username } = useParams();
  const { followers, isLoading, lastUserRef, user } = useGetFollowers({
    username: username!,
  });

  useEffect(() => {
    setUser(user);
  }, [user]);
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
