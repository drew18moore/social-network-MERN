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
    postBody: req.body.postBody,
  });

  try {
    const newPost = await post.save();
    const newPostUser = await User.findById(newPost.userId)
    const response = { ...newPost.toJSON(), fullname: newPostUser.fullname, username: newPostUser.username }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    console.log(req.body)
    console.log(post.userId)
    if (post.userId !== req.body.userId) {
      return res.status(412).json({ message: "You can only delete your own posts" })
    }
    await post.deleteOne()
    res.status(200).json({ message: "Post has been deleted" })
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

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
          fullname: postUser.fullname,
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
