import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoutes from "./components/PrivateRoutes";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "./contexts/AuthContext";
import HeaderBar from "./components/headerBar/HeaderBar";
import NavSideBar from "./components/navSidebar/NavSideBar";
import PlaceholderSidebar from "./components/placeholderSidebar/PlaceholderSidebar";

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
          <Route path="/" element={<Home />} exact />
          <Route path="/:username" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}
