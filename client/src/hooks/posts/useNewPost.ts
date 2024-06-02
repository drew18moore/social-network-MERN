import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxiosPrivate from "../useAxiosPrivate";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";

const useNewPost = ({ onAddPost }: { onAddPost: (post: Post) => void }) => {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const newPost = async ({ postBody, img }: { postBody: string, img: string }) => {
    try {
      const response = await axiosPrivate.post("/api/posts/new", {
        userId: currentUser._id,
        fullname: currentUser.fullname,
        username: currentUser.username,
        postBody,
        img,
      });
      onAddPost(response.data);
      toast.success("Post has been created!", {
        style: {
          backgroundColor: `${theme === "light" ? "" : "#16181c"}`,
          color: `${theme === "light" ? "" : "#fff"}`,
        },
      });
    } catch (err: any) {
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

  return { newPost };
};

export default useNewPost;
