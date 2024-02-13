import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../../components/modal/Modal";
import EditProfile from "../../components/modal/EditProfile";
import "./profile.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { MdArrowBack } from "react-icons/md";
import useGetProfile from "../../hooks/auth/useGetProfile";
import ProfilePosts from "./ProfileList";

export default function Profile() {
  const { username } = useParams();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [followBtnText, setFollowBtnText] = useState("Following");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    setUser,
    isLoading: isLoadingProfile,
    accountExists,
    isFollowing,
    setIsFollowing,
  } = useGetProfile({ username });

  const followUser = async () => {
    try {
      const response = await axiosPrivate.put(`/api/users/follow/${username}`, {
        currUsername: currentUser.username,
      });
      setIsFollowing((prev) => !prev);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  };

  return (
    <div className="profile">
      <div className="profile-top">
        <div className="back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size="1.5rem" />
        </div>
        <p>{user?.fullname}</p>
      </div>
      <div className="profile-card">
        <div className="top">
          <div className="profile-img-username">
            <div className="profile-picture-wrapper">
              <img
                className="profile-picture"
                src={user?.img || "default-pfp.jpg"}
                alt="Profile Picture"
              />
            </div>
            <div className="profile-name-username">
              <h1 className="name">{user?.fullname}</h1>
              <h2 className="username">@{username}</h2>
            </div>
          </div>
          {user?._id === currentUser._id ? (
            <button
              className="edit-profile-btn"
              onClick={() => setShowEditProfileModal((prev) => !prev)}
            >
              Edit profile
            </button>
          ) : accountExists ? (
            <button
              className={
                isFollowing ? "unfollow-profile-btn" : "follow-profile-btn"
              }
              onClick={followUser}
              onMouseEnter={() => setFollowBtnText("Unfollow")}
              onMouseLeave={() => setFollowBtnText("Following")}
            >
              {isFollowing ? followBtnText : "Follow"}
            </button>
          ) : undefined}
        </div>
        <div className="middle">
          <h3 className="bio">{user?.bio}</h3>
        </div>
        <div className="bottom">
          <span className="following" onClick={() => navigate(`following`)}>
            <span className="count">{user?.numFollowing}</span> Following
          </span>
          <span className="followers" onClick={() => navigate("followers")}>
            <span className="count">{user?.numFollowers}</span> Followers
          </span>
        </div>
      </div>
      {accountExists ? (
        <ProfilePosts key={username} username={username} />
      ) : (
        <h2 className="account-doesnt-exist">This account doesn't exist</h2>
      )}

      {showEditProfileModal && (
        <Modal setShowModal={setShowEditProfileModal}>
          <EditProfile
            setUser={setUser}
            setShowModal={setShowEditProfileModal}
          />
        </Modal>
      )}
    </div>
  );
}
