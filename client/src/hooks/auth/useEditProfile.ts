import { useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

interface Props {
  setUser: React.Dispatch<React.SetStateAction<ProfileUser>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface EditProfileRequest {
  displayName: string;
  username: string;
  bio: string;
  img: string;
  password: string;
}

interface EditProfileResponse {
  fullname: string;
  username: string;
  bio: string;
  img: string;
}

const useEditProfile = ({ setUser, setShowModal }: Props) => {
  const axiosPrivate = useAxiosPrivate();
  const { currentUser, setCurrentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const editProfile = async ({
    displayName,
    username,
    bio,
    img,
    password,
  }: EditProfileRequest) => {
    try {
      setError(null);

      const res = await axiosPrivate.put<EditProfileResponse>(
        `/api/users/${currentUser._id}`,
        {
          fullname: displayName,
          username,
          bio,
          img,
          password,
        }
      );
      setCurrentUser((prev) => ({
        ...prev,
        fullname: res.data.fullname,
        username: res.data.username,
        bio: res.data.bio,
        img: res.data.img,
      }));
      setUser((prev) => ({
        ...prev,
        fullname: res.data.fullname,
        username: res.data.username,
        bio: res.data.bio,
        img: res.data.img,
      }));
      setShowModal(false);
      toast.success("Profile has been updated!", {
        style: {
          backgroundColor: `${theme === "light" ? "" : "#16181c"}`,
          color: `${theme === "light" ? "" : "#fff"}`,
        },
      });
      navigate(`/${username}`, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response.data.message || err.message);
      if (err.response?.status === 403) {
        navigate("/login", { state: { from: location }, replace: true });
      }
      toast.error("Error!", {
        style: {
          backgroundColor: `${theme === "light" ? "" : "#16181c"}`,
          color: `${theme === "light" ? "" : "#fff"}`,
        },
      });
    }
  };

  return { editProfile, error };
};

export default useEditProfile;
