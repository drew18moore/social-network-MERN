const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT")

// Edit user info
router.put("/:id", verifyJWT, usersController.editUser);

// Get user by unique username
router.get("/:username", verifyJWT, usersController.getUserByUsername);

// Follow user
router.put("/follow/:username", verifyJWT, usersController.followUser);

// Get all unfollowed users
router.get("/all-unfollowed/:id", verifyJWT, usersController.getUnfollowedUsers);

// Get all followed users
router.get("/:username/following", verifyJWT, usersController.getFollowedUsers);

// Get all followers
router.get("/:username/followers", verifyJWT, usersController.getFollowers);

// DELETE user by id
router.delete("/delete/:userId", verifyJWT, usersController.deleteUser);

// Get all bookmarked posts
router.get("/:id/bookmarks", verifyJWT, usersController.getBookmarkedPosts);

module.exports = router;
