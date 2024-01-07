import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

interface Credentials {
  displayName: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

const useRegister = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (credentials: Credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      if (credentials.password !== credentials.passwordConfirm)
        throw new Error("Passwords do not match");
      const response = await api.post(
        "/api/auth/register",
        {
          fullname: credentials.displayName,
          username: credentials.username,
          password: credentials.password,
          passwordConfirm: credentials.passwordConfirm,
        },
        {
          withCredentials: true,
        }
      );
      setCurrentUser(response.data);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};

export default useRegister;