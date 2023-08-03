import api from "../api/api"
import { useAuth } from "../contexts/AuthContext"

const useRefreshToken = () => {
  const { setCurrentUser } = useAuth();

  const refresh = async () => {
    const response = await api.get("/api/refresh", {
      withCredentials: true
    })
    setCurrentUser((prev: any) => {
      return { ...prev, accessToken: response.data.accessToken }
    })
    return response.data.accessToken;
  }
  return refresh;
}

export default useRefreshToken