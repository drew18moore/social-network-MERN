import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const useDeleteAccount = () => {
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const deleteAccount = async ({ password }: { password: string }) => {
    setError("");
    try {
      const response = await axiosPrivate.delete(
        `api/users/delete/${currentUser._id}`,
        {
          data: { password: password },
        }
      );
      navigate("/login");
    } catch (err: any) {
      setError(
        typeof err.response?.data?.message === "string"
          ? err.response?.data?.message
          : err.message
      );
      console.error(err);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
  };

  return { deleteAccount, error }
};

export default useDeleteAccount;
