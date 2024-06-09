import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import useAxiosPrivate from "../useAxiosPrivate";
import { toast } from "react-hot-toast";

type Props = {
  postId: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onEditPost:
    | ((newPost: EditedPost) => void)
    | ((comment: EditedComment) => void);
  type: "POST" | "COMMENT";
};

const useEditPost = ({ postId, setShowModal, onEditPost, type }: Props) => {
  const { currentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const endpoint =
    type === "POST"
      ? "/api/posts/"
      : type === "COMMENT"
      ? "api/comments/"
      : undefined;

  const editPost = async ({ postBody, postImg }: { postBody: string, postImg: string }) => {
    try {
      const response = await axiosPrivate.put(`${endpoint}/${postId}`, {
        userId: currentUser._id,
        postBody: postBody,
        img: postImg,
      });
      setShowModal(false);
      onEditPost(response.data);
      toast.success("Post has been updated!", {
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

  return { editPost }
};

export default useEditPost;
