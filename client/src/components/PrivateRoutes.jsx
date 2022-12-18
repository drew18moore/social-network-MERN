import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import HeaderBar from "./headerBar/HeaderBar";
import NavSideBar from "./navSidebar/NavSideBar";
import PlaceholderSidebar from "./placeholderSidebar/PlaceholderSidebar";

export default function PrivateRoutes() {
  const { currentUser } = useAuth();
  return currentUser ? (
    <>
      <HeaderBar />
      <div className="app-container">
        <NavSideBar />
        <Outlet />
        <PlaceholderSidebar />
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
}
