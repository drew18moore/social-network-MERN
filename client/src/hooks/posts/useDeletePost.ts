import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import useAxiosPrivate from "../useAxiosPrivate";
import toast from "react-hot-toast";

type Props = {
  postId: string;
  parentId?: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDeletePost: ((postId: string) => void) | ((commentId: string) => void);
  type: "POST" | "COMMENT";
};

const useDeletePost = ({ postId, parentId, setShowModal, onDeletePost, type }: Props) => {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const endpoint =
    type === "POST"
      ? "/api/posts"
      : type === "COMMENT"
      ? "api/comments"
      : undefined;

  const deletePost = async () => {
    try {
      const response = await axiosPrivate.delete(`${endpoint}/${postId}`, {
        data: { userId: currentUser._id, parentId: parentId },
      });
      onDeletePost(response.data._id);
      setShowModal(false);
      toast.success("Post has been deleted!", {
        style: {
          backgroundColor: `${theme === "light" ? "" : "#16181c"}`,
          color: `${theme === "light" ? "" : "#fff"}`,
        },
      });
    } catch (err: any) {
      console.error(err);
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

  return { deletePost }
};

export default useDeletePost;