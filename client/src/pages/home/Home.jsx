import React from "react";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import Timeline from "../../components/timeline/Timeline";

export default function Home() {
  const { currentUser } = useAuth();
  return (
    <>
      <Navbar />
      <Timeline />
    </>
  );
}
