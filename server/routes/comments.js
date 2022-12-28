const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const { post } = require("./posts");

// Edit comment
router.put("/edit/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId !== req.body.userId) {
      return res.status(403).json("You can only update your own comments");
    }

    const updates = {
      commentBody: req.body.postBody,
    };

    Comment.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: err })
        } else {
          return res.status(200).json(result);
        }
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;