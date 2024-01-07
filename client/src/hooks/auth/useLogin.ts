import { useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

interface Credentials {
  username: string;
  password: string;
}

const useLogin = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: Credentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await api.post(
        "/api/auth/login",
        {
          username: credentials.username,
          password: credentials.password,
        },
        { withCredentials: true }
      );
      setCurrentUser(res.data);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
      console.log("DONE");
    }
  };

  return { login, isLoading, error };
};

export default useLogin;
