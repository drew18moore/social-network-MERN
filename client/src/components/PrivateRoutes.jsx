import React, { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import HeaderBar from "./headerBar/HeaderBar";
import NavSideBar from "./navSidebar/NavSideBar";
import RightSidebar from "./rightSidebar/RightSidebar";

export default function PrivateRoutes() {
  const { currentUser } = useAuth();
  return currentUser ? (
    <>
      {/* <HeaderBar /> */}
      <div className="app-container">
        <NavSideBar />
        <div className="main">
          <Suspense>
            <Outlet />
          </Suspense>
        </div>
        <RightSidebar />
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
}
