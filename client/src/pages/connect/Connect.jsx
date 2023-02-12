import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import LoadingAnimation from "../../components/loading/LoadingAnimation";
import User from "../../components/user/User";
import { useAuth } from "../../contexts/AuthContext";
import "./connect.css";

const Connect = () => {
  const { currentUser } = useAuth();
  const [unfollowedUsers, setUnfollowedUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;
  const navigate = useNavigate();
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
      const response = await api.get(
        `/api/users/all-unfollowed/${currentUser._id}?page=${page}&limit=${limit}`
      );
      setUnfollowedUsers((prev) => [...prev, ...response.data.unfollowedUsers]);
      setIsNextPage(response.data.numFound > 0);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="connect-page">
      <div className="connect-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <p>Connect</p>
      </div>
      <div className="unfollowed-users-container">
        <h1 className="connect-h1">People you may know</h1>
        <div className="unfollowed-users">
          {unfollowedUsers &&
            unfollowedUsers.map((user, index) => {
              if (unfollowedUsers.length - 1 === index) {
                return <User ref={lastUserRef} user={user} key={user._id} />;
              }
              return <User user={user} key={user._id} />;
            })}
        </div>
      </div>

      {isLoading && (
        <div className="loading-background">
          <LoadingAnimation />
        </div>
      )}
    </div>
  );
};

export default Connect;
