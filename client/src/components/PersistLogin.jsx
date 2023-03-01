import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";
import LoadingAnimation from "./loading/LoadingAnimation";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const response = await api.get("/api/auth/login/persist", {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        // setIsLoading(false);
      }
    };
    !currentUser?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="persist-loading-background">
          <p>Please wait for the server to load.</p>
          <LoadingAnimation />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
