import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoutes from "./components/PrivateRoutes";
import Profile from "./pages/profile/Profile";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "./contexts/AuthContext";
import Timeline from "./pages/timeline/Timeline";

export default function App() {
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    axios
      .get(`http://192.168.1.2:3000/api/users/${currentUser.username}`)
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
        </Route>
      </Routes>
    </div>
  );
}
