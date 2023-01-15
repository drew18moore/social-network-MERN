const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// CREATE post
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

// EDIT post
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

// DELETE post
router.delete("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId !== req.body.userId) {
      return res
        .status(412)
        .json({ message: "You can only delete your own posts" });
    }
    if (post.comments.length) {
      await Comment.deleteMany({ _id: { $in: post.comments } })
    }
    const response = await post.deleteOne();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// LIKE/UNLIKE post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const numLikes = post.likes.length;
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res
        .status(200)
        .json({ message: "Post has been liked", numLikes: numLikes + 1 });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res
        .status(200)
        .json({ message: "Post has been unliked", numLikes: numLikes - 1 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET all followed user posts, by userId
router.get("/timeline/:userId", async (req, res) => {
  try {
    const page = req.query.page - 1
    const { following } = await User.findById(req.params.userId)
    const allPosts = await Post.find({ userId: {$in: [req.params.userId, ...following]} }, null, { skip: page * req.query.limit, limit: req.query.limit }).sort({ createdAt: -1 });
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
    res.status(200).json({numFound: posts.length, posts: posts});
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Get all posts by username
router.get("/:username/all", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const userPosts = await Post.find({ userId: user._id });
    userPosts.sort((a, b) => {
      return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
    });
    const posts = await Promise.all(
      userPosts.map(async (post) => {
        let profilePicture;
        if (user.img.data) {
          const buffer = Buffer.from(user.img.data);
          const b64String = buffer.toString("base64");
          profilePicture = `data:image/png;base64,${b64String}`;
        } else {
          profilePicture = "/default-pfp.jpg";
        }

        return {
          ...post.toJSON(),
          fullname: user.fullname,
          username: user.username,
          profilePicture: profilePicture,
        };
      })
    );
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET post
router.get("/:username/:id", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const post = await Post.findById(req.params.id);

    let profilePicture;
    if (user.img.data) {
      const buffer = Buffer.from(user.img.data);
      const b64String = buffer.toString("base64");
      profilePicture = `data:image/png;base64,${b64String}`;
    } else {
      profilePicture = "/default-pfp.jpg";
    }

    // get all comments by id
    let comments;
    await Promise.all(
      post.comments.map(async (commentId) => {
        const comment = await Comment.findById(commentId);
        const commentUser = await User.findById(comment.userId);
        
        let commentProfilePicture;
        if (commentUser.img.data) {
          const buffer = Buffer.from(commentUser.img.data);
          const b64String = buffer.toString("base64");
          commentProfilePicture = `data:image/png;base64,${b64String}`;
        } else {
          commentProfilePicture = "/default-pfp.jpg";
        }

        const commentWithUserData = {
          ...comment.toJSON(),
          fullname: commentUser.fullname,
          username: commentUser.username,
          profilePicture: commentProfilePicture,
        }
        return commentWithUserData;
      })
    ).then((values) => {
      comments = values;
    });

    const postData = {
      ...post.toJSON(),
      fullname: user.fullname,
      username: user.username,
      profilePicture: profilePicture,
      comments: comments
    };

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE comment
router.post("/:postId/comment", async (req, res) => {
  if (req.body.commentBody === "") {
    return res.status(412).json({ message: "You must type a message." });
  }

  const comment = new Comment({
    userId: req.body.userId,
    commentBody: req.body.commentBody,
  });

  try {
    const newComment = await comment.save();
    const post = await Post.findById(req.params.postId);
    post.comments.unshift(newComment._id.toString());
    await post.save();
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
