import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../useAxiosPrivate";

const useLogout = () => {
  const { setCurrentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  return async () => {
    setCurrentUser({} as User);
    try {
      await axiosPrivate.get("/api/logout");
    } catch (err) {
      console.error(err);
    }
  };
};

export default useLogout;
