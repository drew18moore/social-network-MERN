/// <reference types="vite/client" />

type User = {
  _id: string;
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
  img: string;
  numLikes: number;
  numComments: number;
  createdAt: Date;
  fullname: string;
  username: string;
  isLiked: boolean;
  profilePicture: string;
};

type EditedPost = {
  _id: string;
  postBody: string;
  img?: string;
};

type ProfileUser = {
  _id: string;
  fullname: string;
  username: string;
  numFollowing: number;
  numFollowers: number;
  isFollowing: boolean;
  img: string;
  bio: string;
};

type PostComment = {
  _id: string;
  fullname: string;
  username: string;
  commentBody: string;
  profilePicture: string;
  parentId: string;
  numLikes: number;
  isLiked: boolean;
};

type NewComment = {
  _id: string;
  userId: string;
  parentId: string;
  commentBody: string;
  createdAt: Date;
}

type EditedComment = {
  _id: string;
  commentBody: string;
};

type UnfollowedUser = {
  _id: string;
  fullname: string;
  username: string;
  img: string;
};

type UserConnection = {
  _id: string;
  fullname: string;
  username: string;
  img: string;
  isFollowing: boolean;
}