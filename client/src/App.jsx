import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FollowersFollowing from "./pages/followersFollowing/FollowersFollowing";
import PostPage from "./pages/post/PostPage";
import Settings from "./pages/settings/Settings";
import Connect from "./pages/connect/Connect";
import PrivateRoutes from "./components/PrivateRoutes";
import "./App.css";
import PersistLogin from "./components/PersistLogin";

const Timeline = lazy(() => import("./pages/timeline/Timeline"));
const Profile = lazy(() => import("./pages/profile/Profile"));

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PersistLogin />}>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Timeline />} exact />
            <Route path="/connect" element={<Connect />} exact />
            <Route path="/:username" element={<Profile />} />
            <Route
              path="/:username/following"
              element={<FollowersFollowing tab="following" />}
            />
            <Route
              path="/:username/followers"
              element={<FollowersFollowing tab="followers" />}
            />
            <Route path="/:username/posts/:postId" element={<PostPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
