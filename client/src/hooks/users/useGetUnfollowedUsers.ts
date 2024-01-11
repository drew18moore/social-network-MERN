import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";

const useGetUnfollowedUsers = () => {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [unfollowedUsers, setUnfollowedUsers] = useState<UnfollowedUser[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isNextPage, setIsNextPage] = useState(true);
  const limit = 20;

  const navigate = useNavigate();
  const location = useLocation();

  const observer = useRef<IntersectionObserver>();
  const lastUserRef = useCallback(
    (element: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (element && isNextPage) observer.current.observe(element);
    },
    [isLoading]
  );

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(
        `/api/users/all-unfollowed/${currentUser._id}?page=${page}&limit=${limit}`
      );
      setUnfollowedUsers((prev) => [...prev, ...response.data.unfollowedUsers]);
      setIsNextPage(response.data.numFound > 0);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return { unfollowedUsers, lastUserRef, isLoading };
};

export default useGetUnfollowedUsers;
