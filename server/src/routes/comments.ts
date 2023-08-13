import { verifyJWT } from "../middleware/verifyJWT";
import express, { Router } from "express";
import { newComment, editComment, deleteComment, likeComment } from "../controllers/commentsController";
const commentRouter: Router = express.Router()

// Create new comment
commentRouter.post("/new", verifyJWT, newComment);

commentRouter.route("/:id")
  // Edit comment
  .put(verifyJWT, editComment)
  // Delete comment
  .delete(verifyJWT, deleteComment);
  // Like comment
commentRouter.put("/:id/like", verifyJWT, likeComment);

export default commentRouter
