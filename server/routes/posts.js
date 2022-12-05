const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.post("/new", async (req, res) => {
  if (req.body.postBody === "") {
    return res.status(412).json({ message: "You must type a message." });
  }

  const post = new Post({
    userId: req.body.userId,
    // username: req.body.username,
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
    const allPosts = await Post.find();
    allPosts.sort((a, b) => {
      return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
    });
    const posts = await Promise.all(
      allPosts.map(async (post) => {
        const postUser = await User.findById(post.userId)
        return {
          ...post.toJSON(),
          username: postUser.username,
        };
      })
    );
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
