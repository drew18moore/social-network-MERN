const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const multer = require("../middleware/multer")

// Change profile picture
router.put(
  "/change-img/:id",
  multer.upload.single("image"),
  usersController.changeProfilePicture
);

// Edit user info
router.put("/:id", usersController.editUser);

// Get user by unique username
router.get("/:username", usersController.getUserByUsername);

// Follow user
router.put("/follow/:username", usersController.followUser);

// Get all unfollowed users
router.get("/all-unfollowed/:id", usersController.getUnfollowedUsers);

// Get all followed users
router.get("/:username/following", usersController.getFollowedUsers);

// Get all followers
router.get("/:username/followers", usersController.getFollowers);

// DELETE user by id
router.delete("/delete/:userId", usersController.deleteUser);

module.exports = router;
