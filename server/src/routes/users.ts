// const express = require("express");
// const router = express.Router();
// const usersController = require("../controllers/usersController");
// const verifyJWT = require("../middleware/verifyJWT")

import express, { Router } from "express";
import {
  editUser,
  getUserByUsername,
  followUser,
  getUnfollowedUsers,
  getFollowedUsers,
  getFollowers,
  deleteUser,
  getBookmarkedPosts,
} from "../controllers/usersController";
import { verifyJWT } from "../middleware/verifyJWT";

const usersRouter: Router = express.Router()

// Edit user info
usersRouter.put("/:id", verifyJWT, editUser);

// Get user by unique username
usersRouter.get("/:username", verifyJWT, getUserByUsername);

// Follow user
usersRouter.put("/follow/:username", verifyJWT, followUser);

// Get all unfollowed users
usersRouter.get(
  "/all-unfollowed/:id",
  verifyJWT,
  getUnfollowedUsers
);

// Get all followed users
usersRouter.get("/:username/following", verifyJWT, getFollowedUsers);

// Get all followers
usersRouter.get("/:username/followers", verifyJWT, getFollowers);

// DELETE user by id
usersRouter.delete("/delete/:userId", verifyJWT, deleteUser);

// Get all bookmarked posts
usersRouter.get("/:id/bookmarks", verifyJWT, getBookmarkedPosts);

export default usersRouter;
