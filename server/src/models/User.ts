import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  fullname: string;
  username: string;
  password: string;
  bio: string;
  img: string;
  following: string[];
  followers: string[];
  refreshToken: string;
  bookmarks: string[];
}

const UserSchema = new mongoose.Schema<IUser>({
  fullname: {
    type: String,
    required: true,
    unique: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  img: {
    type: String,
    default: "",
  },
  following: {
    type: [String],
    default: [],
  },
  followers: {
    type: [String],
    default: [],
  },
  refreshToken: {
    type: String,
  },
  bookmarks: {
    type: [String],
    default: [],
  },
});

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
