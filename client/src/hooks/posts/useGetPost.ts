import { useEffect, useState } from "react";
import useAxiosPrivate from "../useAxiosPrivate";
import { useNavigate } from "react-router-dom";

type Post = {
  _id: string;
  userId: string;
  postBody: string;
  comments: PostComment[];
  createdAt: Date;
  fullname: string;
  username: string;
  profilePicture: string;
  isBookmarked: boolean;
  isLiked: boolean;
  numLikes: number;
};

const useGetPost = (postId: string) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post>({} as Post);
  const [liked, setLiked] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState();
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get(`/api/posts/${postId}`);
        setPost(response.data);
        setLiked(response.data.isLiked);
        setNumberOfLikes(response.data.numLikes);
        setNumberOfComments(response.data.comments.length);
        setIsBookmarked(response.data.isBookmarked);
        console.log(response.data);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 403) {
          navigate("/login", { state: { from: location }, replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  return { post, setPost, liked, setLiked, numberOfLikes, setNumberOfLikes, numberOfComments, setNumberOfComments, isBookmarked, setIsBookmarked, isLoading }
};

export default useGetPost;
