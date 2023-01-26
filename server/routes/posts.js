const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

// CREATE post
router.post("/new", postsController.createNewPost);

// EDIT post
router.put("/:id", postsController.editPost);

// DELETE post
router.delete("/:id", postsController.deletePost);

// LIKE/UNLIKE post
router.put("/like/:id", postsController.likePost);

// GET all followed user posts, by userId
router.get("/timeline/:userId", postsController.getTimelinePosts);

// Get all posts by username
router.get("/:username/all", postsController.getPostsByUsername);

// GET post
router.get("/:id", postsController.getPostById);

// CREATE comment
router.post("/:postId/comment", postsController.createNewComment);

module.exports = router;
