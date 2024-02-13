import { useEffect, useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const useGetProfile = ({ username }: { username: string | undefined }) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<ProfileUser>({} as ProfileUser);
  const [accountExists, setAccountExists] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(`/api/users/${username}`);
        setUser(response.data);
        setIsFollowing(response.data.isFollowing);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 404) {
          setAccountExists(false);
        }
        if (err.response?.status === 403) {
          navigate("/login", { state: { from: location }, replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  return { user, setUser, isLoading, accountExists, isFollowing, setIsFollowing };
};

export default useGetProfile;
