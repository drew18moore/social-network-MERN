const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");
const verifyJWT = require("../middleware/verifyJWT");

// Create new comment
router.post("/new", verifyJWT, commentsController.newComment);

router.route("/:id")
  // Edit comment
  .put(verifyJWT, commentsController.editComment)
  // Delete comment
  .delete(verifyJWT, commentsController.deleteComment)
  // Like comment
  .put("/like", verifyJWT, commentsController.likeComment);

module.exports = router;
