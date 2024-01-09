import { useCallback, useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";

type User = {
  fullname: string;
  username: string;
}

const useGetFollowing = ({ username }: { username: string }) => {
  const axiosPrivate = useAxiosPrivate();
  const [following, setFollowing] = useState<UserConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>({} as User);
  const [page, setPage] = useState(1);
  const [isNextPage, setIsNextPage] = useState(true);
  const limit = 10;
  const fetchData = async () => {
    try {
      console.log(page);
      setIsLoading(true);
      const res = await axiosPrivate.get(
        `/api/users/${username}/following?page=${page}&limit=${limit}`
      );
      setFollowing((prev) => [...prev, ...res.data.following]);
      setIsNextPage(res.data.numFound > 0)
      setUser(res.data.user)
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchData();
  }, [username, page]);

  return { following, isLoading, lastUserRef, user };
};

export default useGetFollowing
