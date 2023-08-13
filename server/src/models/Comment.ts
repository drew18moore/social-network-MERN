import mongoose, { Document } from "mongoose";

interface IComment extends Document {
  userId: string;
  parentId: string;
  commentBody: string;
  createdAt: Date;
  likes: string[];
  comments: string[];
}
const CommentSchema = new mongoose.Schema<IComment>({
  userId: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    required: true,
  },
  commentBody: {
    type: String,
    required: true,
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

const CommentModel = mongoose.model("Comment", CommentSchema);
export default CommentModel;
