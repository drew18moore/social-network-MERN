import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PostPage from "./pages/post/PostPage";
import Settings from "./pages/settings/Settings";
import Connect from "./pages/connect/Connect";
import Bookmarks from "./pages/bookmarks/Bookmarks";
import PrivateRoutes from "./components/PrivateRoutes";
import "./App.css";
import PersistLogin from "./components/PersistLogin";
import UserConnections from "./pages/user-connections/UserConnections";
import FollowingList from "./pages/user-connections/components/FollowingList";
import FollowersList from "./pages/user-connections/components/FollowersList";

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
            <Route path="/" element={<Timeline />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/:username" element={<Profile />} />
            <Route element={<UserConnections />}>
              <Route path="/:username/following" element={<FollowingList />} />
              <Route path="/:username/followers" element={<FollowersList />} />
            </Route>
            <Route path="/:username/posts/:postId" element={<PostPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
