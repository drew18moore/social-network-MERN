import "./App.css";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoutes from "./components/PrivateRoutes";
// import Profile from "./pages/profile/Profile";
import { useEffect } from "react";
import api from "./api/api";
import { useAuth } from "./contexts/AuthContext";
// import Timeline from "./pages/timeline/Timeline";
import FollowersFollowing from "./pages/followersFollowing/FollowersFollowing";
import PostPage from "./pages/post/PostPage";
import Settings from "./pages/settings/Settings";

const Timeline = lazy(() => import("./pages/timeline/Timeline"));
const Profile = lazy(() => import("./pages/profile/Profile"));

export default function App() {
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    currentUser &&
      api
        .get(`/api/users/${currentUser.username}`)
        .then((res) => setCurrentUser(res.data));
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Timeline />} exact />
          <Route path="/:username" element={<Profile />} />
          <Route
            path="/:username/following"
            element={<FollowersFollowing page="following" />}
          />
          <Route
            path="/:username/followers"
            element={<FollowersFollowing page="followers" />}
          />
          <Route path="/:username/posts/:postId" element={<PostPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
}
