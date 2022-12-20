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
    const newPostUser = await User.findById(newPost.userId);

    let profilePicture;
    if (newPostUser.img.data) {
      const buffer = Buffer.from(newPostUser.img.data);
      const b64String = buffer.toString("base64");
      profilePicture = `data:image/png;base64,${b64String}`;
    } else {
      profilePicture = "/default-pfp.jpg";
    }
    const response = {
      ...newPost.toJSON(),
      fullname: newPostUser.fullname,
      username: newPostUser.username,
      profilePicture: profilePicture,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId !== req.body.userId) {
      return res.status(403).json("You can only update your own posts");
    }

    const updates = {
      postBody: req.body.postBody,
    };

    Post.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true },
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: err });
        } else {
          return res.status(200).json(result);
        }
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(req.body);
    console.log(post.userId);
    if (post.userId !== req.body.userId) {
      return res
        .status(412)
        .json({ message: "You can only delete your own posts" });
    }
    const response = await post.deleteOne();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const numLikes = post.likes.length;
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({ message: "Post has been liked", numLikes: numLikes + 1 });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({ message: "Post has been unliked", numLikes: numLikes - 1 });
    }
  } catch (err) {
    res.status(500).json(err);
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
        const postUser = await User.findById(post.userId);

        let profilePicture;
        if (postUser.img.data) {
          const buffer = Buffer.from(postUser.img.data);
          const b64String = buffer.toString("base64");
          profilePicture = `data:image/png;base64,${b64String}`;
        } else {
          profilePicture = "/default-pfp.jpg";
        }

        return {
          ...post.toJSON(),
          fullname: postUser.fullname,
          username: postUser.username,
          profilePicture: profilePicture,
        };
      })
    );
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
