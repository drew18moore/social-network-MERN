/// <reference types="vite/client" />

type User = {
  id: string;
  fullname: string;
  username: string;
  accessToken: string;
  bio: string;
  img?: string;
};

type Post = {
  _id: string;
  userId: string;
  postBody: string;
  likes: string[];
  comments: string[];
  createdAt: Date;
  fullname: string;
  username: string;
  profilePicture: string;
};

type EditedPost = {
  _id: string
  postBody: string
}
