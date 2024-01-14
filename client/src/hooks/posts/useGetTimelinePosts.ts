import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../useAxiosPrivate";

const useGetTimelinePosts = () => {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [isNextPage, setIsNextPage] = useState(true);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get(
        `/api/posts/timeline/${currentUser._id}?page=${page}&limit=${limit}`
      );
      setPosts((prev) => [...prev, ...response.data.posts]);
      setIsNextPage(response.data.numFound > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, axiosPrivate, currentUser._id, navigate, location]);

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

  return { posts, setPosts, isLoading, lastPostRef };
};

export default useGetTimelinePosts;
