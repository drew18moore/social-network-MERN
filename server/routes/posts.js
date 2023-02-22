const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const verifyJWT = require("../middleware/verifyJWT");

// CREATE post
router.post("/new", verifyJWT, postsController.createNewPost);

router.route("/:id")
  // get post by id
  .get(verifyJWT, postsController.getPostById)
  // edit post by id
  .put(verifyJWT, postsController.editPost)
  // delete post by id
  .delete(verifyJWT, postsController.deletePost);

// LIKE/UNLIKE post
router.put("/:id/like", verifyJWT, postsController.likePost);

// BOOKMARK/UNBOOKMARK Post
router.put("/:id/bookmark", verifyJWT, postsController.bookmarkPost);

// GET all followed user posts, by userId
router.get("/timeline/:userId", verifyJWT, postsController.getTimelinePosts);

// Get all posts by username
router.get("/:username/all", verifyJWT, postsController.getPostsByUsername);

module.exports = router;
