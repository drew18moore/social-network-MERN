import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, Outlet } from "react-router-dom";
import User from "../../components/user/User";
import "./userConnections.css";
import { MdArrowBack } from "react-icons/md";

type User = {
  fullname: string;
  username: string;
};

export default function UserConnections() {
  const { username } = useParams();
  const [user, setUser] = useState<User>({} as User);
  const navigate = useNavigate();
  const location = useLocation();
  const [currTab, setCurrTab] = useState<string>();

  useEffect(() => {
    setCurrTab(
      location.pathname.includes("following") ? "following" : "followers"
    );
  }, [location]);

  return (
    <div className="followers-following-page">
      <div className="header">
        <div className="top">
          <div className="back-btn" onClick={() => navigate(-1)}>
            <MdArrowBack size="1.5rem" />
          </div>
          <div className="following-user-info">
            <p className="fullname">{user.fullname}</p>
            <p className="username">@{username}</p>
          </div>
        </div>
        <div className="links">
          <div
            className={`followers-link ${
              currTab === "followers" && "active-link"
            }`}
            onClick={() => {
              setCurrTab("followers");
              navigate(`/${username}/followers`);
            }}
          >
            Followers
          </div>
          <div
            className={`following-link ${
              currTab === "following" && "active-link"
            }`}
            onClick={() => {
              setCurrTab("following");
              navigate(`/${username}/following`);
            }}
          >
            Following
          </div>
        </div>
      </div>
      <div className="user-connections">
        <Outlet context={[setUser]} />
      </div>
    </div>
  );
}
