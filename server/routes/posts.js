const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.post("/new", async (req, res) => {
  if (req.body.postBody === "") {
    return res.status(412).json({ message: "You must type a message." });
  }

  const post = new Post({
    userId: req.body.userId,
    postBody: req.body.postBody,
  });

  try {
    const newPost = await post.save();
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/timeline", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
