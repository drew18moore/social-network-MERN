import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../useAxiosPrivate";
import { useCallback, useEffect, useRef, useState } from "react";

const useGetBookmarkedPosts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [bookmarks, setBookmarks] = useState<Post[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [isNextPage, setIsNextPage] = useState(true);

  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useCallback(
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

  const fetchPosts = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/users/${currentUser._id}/bookmarks?page=${page}&limit=${limit}`
      );
      setBookmarks((prev) => [...prev, ...response.data.posts]);
      setIsNextPage(response.data.numFound > 0);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [page]);

  return { bookmarks, setBookmarks, isLoading, lastPostRef }
}

export default useGetBookmarkedPosts;