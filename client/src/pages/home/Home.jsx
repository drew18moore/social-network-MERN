import React from "react";
import HeaderBar from "../../components/headerBar/HeaderBar";
import { useAuth } from "../../contexts/AuthContext";
import Timeline from "../../components/timeline/Timeline";
import NavSideBar from "../../components/navSidebar/NavSideBar";
import "./home.css"
import PlaceholderSidebar from "../../components/placeholderSidebar/PlaceholderSidebar";

export default function Home() {
  const { currentUser } = useAuth();
  return (
    <>
      <HeaderBar />
      <div className="home-contents">
        <NavSideBar />
        <Timeline />
        <PlaceholderSidebar />
      </div>
    </>
    // <>
    //   <Navbar />
    //   <Timeline />
    // </>
  );
}
