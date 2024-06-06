import mongoose, { Document } from "mongoose";

interface IPost extends Document {
  userId: string;
  postBody: string;
  img: string;
  createdAt: Date;
  likes: string[];
  comments: string[];
}
const PostSchema = new mongoose.Schema<IPost>({
  userId: {
    type: String,
    required: true,
  },
  postBody: {
    type: String,
    default: "",
  },
  img: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  likes: {
    type: [String],
    default: [],
  },
  comments: {
    type: [String],
    defalut: [],
  },
});

const PostModel = mongoose.model<IPost>("Post", PostSchema);
export default PostModel
