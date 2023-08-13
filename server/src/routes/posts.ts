import express, { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import {
  createNewPost,
  getPostById,
  editPost,
  deletePost,
  likePost,
  bookmarkPost,
  getTimelinePosts,
  getPostsByUsername,
} from "../controllers/postsController";

const postsRouter: Router = express.Router();

// CREATE post
postsRouter.post("/new", verifyJWT, createNewPost);

postsRouter
  .route("/:id")
  // get post by id
  .get(verifyJWT, getPostById)
  // edit post by id
  .put(verifyJWT, editPost)
  // delete post by id
  .delete(verifyJWT, deletePost);

// LIKE/UNLIKE post
postsRouter.put("/:id/like", verifyJWT, likePost);

// BOOKMARK/UNBOOKMARK Post
postsRouter.put("/:id/bookmark", verifyJWT, bookmarkPost);

// GET all followed user posts, by userId
postsRouter.get("/timeline/:userId", verifyJWT, getTimelinePosts);

// Get all posts by username
postsRouter.get("/:username/all", verifyJWT, getPostsByUsername);

export default postsRouter;
