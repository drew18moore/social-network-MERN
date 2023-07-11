import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import User from "../../components/user/User";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./connect.css";
import { MdArrowBack } from "react-icons/md";
import { UserSkeleton } from "../../components/loading/SkeletonLoading";

const Connect = () => {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [unfollowedUsers, setUnfollowedUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;
  const navigate = useNavigate();
  const location = useLocation();

  const [isNextPage, setIsNextPage] = useState(true);

  const observer = useRef();
  const lastUserRef = useCallback(
    (element) => {
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
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const skeletons = () => {
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(<UserSkeleton key={i} />);
    }

    return <>{arr}</>;
  };

  return (
    <div className="connect-page">
      <div className="connect-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size="1.5rem" />
        </div>
        <p>Connect</p>
      </div>
      <div className="unfollowed-users-container">
        <h1 className="connect-h1">People you may know</h1>
        {unfollowedUsers.length !== 0 && (
          <div className="unfollowed-users">
            {unfollowedUsers &&
              unfollowedUsers.map((user, index) => {
                if (unfollowedUsers.length - 1 === index) {
                  return <User ref={lastUserRef} user={user} key={user._id} />;
                }
                return <User user={user} key={user._id} />;
              })}
          </div>
        )}
        {isLoading && <div className="user-skeleton-container">{skeletons()}</div>}
      </div>
    </div>
  );
};

export default Connect;
