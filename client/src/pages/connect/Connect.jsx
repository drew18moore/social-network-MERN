import { createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import User from "../../components/user/User";
import { useAuth } from "../../contexts/AuthContext";
import "./connect.css";

const Connect = () => {
  const { currentUser } = useAuth();
  const [unfollowedUsers, setUnfollowedUsers] = useState([]);
  const limit = 5;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await api.get(
        `/api/users/all-unfollowed/${currentUser._id}?page=1&limit=${limit}`
      );
      setUnfollowedUsers((prev) => [...prev, ...response.data.unfollowedUsers])
      console.log(response.data)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="connect-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <p>Connect</p>
      </div>
      <h1 className="connect-h1">People you may know</h1>
      <div className="unfollowed-users">
        {unfollowedUsers && unfollowedUsers.map((user) => <User user={user} key={user._id}/>)}
      </div>
    </>
  );
};

export default Connect;
