import React from "react";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import NewPost from "../../components/newPost/NewPost";

export default function Home() {
  const { currentUser } = useAuth();
  return (
    <>
      <Navbar />
      <NewPost />
    </>
  );
}
