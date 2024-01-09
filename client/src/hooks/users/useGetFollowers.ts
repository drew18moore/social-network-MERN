import { useCallback, useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";

type User = {
  fullname: string;
  username: string;
}

const useGetFollowers = ({ username }: { username: string }) => {
  const axiosPrivate = useAxiosPrivate();
  const [followers, setFollowers] = useState<UserConnection[]>([]);
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
        `/api/users/${username}/followers?page=${page}&limit=${limit}`
      );
      setFollowers((prev) => [...prev, ...res.data.followers]);
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

  return { followers, isLoading, lastUserRef, user };
};

export default useGetFollowers
