const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController")

// Edit comment
router.put("/:id", commentsController.editComment);

// Delete comment
router.delete("/:id", commentsController.deleteComment);

module.exports = router;
