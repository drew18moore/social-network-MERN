const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

// Create new comment
router.post("/new", commentsController.newComment);

router.route("/:id")
  // Edit comment
  .put(commentsController.editComment)
  // Delete comment
  .delete(commentsController.deleteComment);

module.exports = router;
