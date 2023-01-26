const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController")

// Edit comment
router.put("/edit/:id", commentsController.editComment);

// Delete comment
router.delete("/delete/:id", commentsController.deleteComment);

module.exports = router;
