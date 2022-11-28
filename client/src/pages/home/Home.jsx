import React from "react";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();
  return (
    <>
      <Navbar />
      <div>Hello, {currentUser.username}</div>
    </>
  );
}
