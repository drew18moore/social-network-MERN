const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

// CREATE post
router.post("/new", postsController.createNewPost);

router.route("/:id")
  // get post by id
  .get(postsController.getPostById)
  // edit post by id
  .put(postsController.editPost)
  // delete post by id
  .delete(postsController.deletePost);

// LIKE/UNLIKE post
router.put("/like/:id", postsController.likePost);

// GET all followed user posts, by userId
router.get("/timeline/:userId", postsController.getTimelinePosts);

// Get all posts by username
router.get("/:username/all", postsController.getPostsByUsername);

// CREATE comment
router.post("/:postId/comment", postsController.createNewComment);

module.exports = router;
