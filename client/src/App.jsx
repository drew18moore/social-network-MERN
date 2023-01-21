import { useEffect, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import api from "./api/api";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FollowersFollowing from "./pages/followersFollowing/FollowersFollowing";
import PostPage from "./pages/post/PostPage";
import Settings from "./pages/settings/Settings";
import PrivateRoutes from "./components/PrivateRoutes";
import "./App.css";
import { useTheme } from "./contexts/ThemeContext";

const Timeline = lazy(() => import("./pages/timeline/Timeline"));
const Profile = lazy(() => import("./pages/profile/Profile"));

export default function App() {
  const { currentUser, setCurrentUser } = useAuth();
  const { theme } = useTheme();

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
