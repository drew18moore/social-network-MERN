import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import User from "../../components/user/User";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./followersFollowing.css";
import { MdArrowBack } from "react-icons/md";

type Props = {
  tab: "following" | "followers";
};
type User = {
  fullname: string;
  username: string;
};
type FollowerFollowing = {
  _id: string;
  fullname: string;
  username: string;
  img: string;
  isFollowing: boolean;
};

export default function FollowersFollowing({ tab }: Props) {
  const { username } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState<User>({} as User);
  const [followers, setFollowers] = useState<FollowerFollowing[]>([]);
  const [following, setFollowing] = useState<FollowerFollowing[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [currTab, setCurrTab] = useState(tab);

  const [pageFollowing, setPageFollowing] = useState(1);
  const [pageFollowers, setPageFollowers] = useState(1);
  const limit = 10;
  const [isNextPageFollowers, setIsNextPageFollowers] = useState(true);
  const [isNextPageFollowing, setIsNextPageFollowing] = useState(true);

  useEffect(() => {
    setCurrTab(tab);
  }, [location]);

  useEffect(() => {
    setFollowers([]);
    setFollowing([]);
    setPageFollowers(1);
    setPageFollowing(1);
    setIsNextPageFollowers(true);
    setIsNextPageFollowing(true);
    const fetchData = async () => {
      try {
        const [responseFollowers, responseFollowing] = await Promise.all([
          axiosPrivate.get(
            `/api/users/${username}/followers?page=1&limit=${limit}`
          ),
          axiosPrivate.get(
            `/api/users/${username}/following?page=1&limit=${limit}`
          ),
        ]);
        responseFollowers.data.numFound < limit
          ? setIsNextPageFollowers(false)
          : setIsNextPageFollowers(true);
        responseFollowing.data.numFound < limit
          ? setIsNextPageFollowing(false)
          : setIsNextPageFollowing(true);
        setUser(responseFollowers.data.user);
        setFollowers(responseFollowers.data.followers);
        setFollowing(responseFollowing.data.following);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    fetchData();
  }, [username, currTab]);

  const loadMoreFollowers = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/users/${username}/followers?page=${
          pageFollowers + 1
        }&limit=${limit}`
      );
      response.data.numFound === 0
        ? setIsNextPageFollowers(false)
        : setFollowers((prev) => [...prev, ...response.data.followers]);
      setPageFollowers((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };
  const loadMoreFollowing = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/users/${username}/following?page=${
          pageFollowing + 1
        }&limit=${limit}`
      );
      response.data.numFound === 0
        ? setIsNextPageFollowing(false)
        : setFollowing((prev) => [...prev, ...response.data.following]);
      setPageFollowing((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="followers-following-page">
      <div className="header">
        <div className="top">
          <div className="back-btn" onClick={() => navigate(-1)}>
            <MdArrowBack size="1.5rem" />
          </div>
          <div className="following-user-info">
            <p className="fullname">{user.fullname}</p>
            <p className="username">@{user.username}</p>
          </div>
        </div>
        <div className="links">
          <div
            className={`followers-link ${
              currTab === "followers" && "active-link"
            }`}
            onClick={() => {
              setCurrTab("followers");
              navigate(`/${user.username}/followers`);
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
              navigate(`/${user.username}/following`);
            }}
          >
            Following
          </div>
        </div>
      </div>
      <div className="followed-users">
        {currTab === "followers" &&
          followers.map((user) => {
            return <User key={user._id} user={user} />;
          })}
        {currTab === "followers" && isNextPageFollowers && (
          <button onClick={loadMoreFollowers} className="load-more">
            Load More
          </button>
        )}
        {currTab === "following" &&
          following.map((user) => {
            return <User key={user._id} user={user} />;
          })}
        {currTab === "following" && isNextPageFollowing && (
          <button onClick={loadMoreFollowing} className="load-more">
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
