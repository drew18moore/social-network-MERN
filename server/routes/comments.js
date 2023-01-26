const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");

router.route("/:id")
  // Edit comment
  .put(commentsController.editComment)
  // Delete comment
  .delete(commentsController.deleteComment);

module.exports = router;
