const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

const createNewPost = async (req, res) => {
  if (!req.body.postBody || req.body.postBody === "") {
    return res.status(412).json({ message: "You must type a message." });
  }

  const post = new Post({
    userId: req.userId,
    postBody: req.body.postBody,
  });

  try {
    const newPost = await post.save();
    const newPostUser = await User.findById(newPost.userId);

    const response = {
      _id: newPost._id,
      userId: newPost.userId,
      postBody: newPost.postBody,
      numLikes: 0,
      numComments: 0,
      createdAt: newPost.createdAt,
      fullname: newPostUser.fullname,
      username: newPostUser.username,
      isLiked: false,
      profilePicture: newPostUser.img || "default-pfp.jpg",
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const author = await User.findOne({ _id: post.userId });

    // get current user
    const currUser = await User.findById(req.userId);
    if (!currUser) return res.status(403).json({ message: "Forbidden" });

    // get all comments by id
    let comments;
    await Promise.all(
      post.comments.map(async (commentId) => {
        const comment = await Comment.findById(commentId);
        const commentUser = await User.findById(comment.userId);

        const commentWithUserData = {
          commentBody: comment.commentBody,
          _id: comment._id,
          parentId: comment.parentId,
          fullname: commentUser.fullname,
          username: commentUser.username,
          profilePicture: commentUser.img || "default-pfp.jpg",
          isLiked: comment.likes.includes(currUser._id),
          numLikes: comment.likes.length,
        };
        return commentWithUserData;
      })
    ).then((values) => {
      comments = values;
    });

    const postData = {
      createdAt: post.createdAt,
      fullname: author.fullname,
      username: author.username,
      numLikes: post.likes.length,
      isLiked: post.likes.includes(currUser._id),
      postBody: post.postBody,
      userId: post.userId,
      _id: post._id,
      profilePicture: author.img || "default-pfp.jpg",
      comments: comments,
      isBookmarked: currUser.bookmarks.includes(post._id),
    };

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
};

const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found" });
    if (post.userId !== req.userId) {
      return res.status(403).json("You can only update your own posts");
    }

    post.postBody = req.body.postBody;
    post.save();

    const postData = {
      _id: post._id,
      postBody: post.postBody,
    };
    return res.status(200).json(postData);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId !== req.userId) {
      return res
        .status(412)
        .json({ message: "You can only delete your own posts" });
    }
    if (post.comments.length) {
      await Comment.deleteMany({ _id: { $in: post.comments } });
    }
    // Remove postId from bookmarks
    await User.updateMany(
      { bookmarks: post._id.toString() },
      { $pull: { bookmarks: post._id.toString() } }
    );
    const response = await post.deleteOne();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const numLikes = post.likes.length;
    if (!post.likes.includes(req.userId)) {
      await post.updateOne({ $push: { likes: req.userId } });
      res
        .status(200)
        .json({ message: "Post has been liked", numLikes: numLikes + 1 });
    } else {
      await post.updateOne({ $pull: { likes: req.userId } });
      res
        .status(200)
        .json({ message: "Post has been unliked", numLikes: numLikes - 1 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTimelinePosts = async (req, res) => {
  try {
    const page = req.query.page - 1;
    const { following } = await User.findById(req.userId);
    const allPosts = await Post.find(
      { userId: { $in: [req.userId, ...following] } },
      null,
      { skip: page * req.query.limit, limit: req.query.limit }
    ).sort({ createdAt: -1 });
    const posts = await Promise.all(
      allPosts.map(async (post) => {
        const postUser = await User.findById(post.userId);

        return {
          _id: post._id,
          userId: post.userId,
          postBody: post.postBody,
          numLikes: post.likes.length,
          numComments: post.comments.length,
          createdAt: post.createdAt,
          fullname: postUser.fullname,
          username: postUser.username,
          isLiked: post.likes.includes(req.userId),
          profilePicture: postUser.img || "default-pfp.jpg",
        };
      })
    );
    res.status(200).json({ numFound: posts.length, posts: posts });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getPostsByUsername = async (req, res) => {
  try {
    const page = req.query.page - 1 || 0;
    const limit = req.query.limit || 0;
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const userPosts = await Post.find({ userId: user._id }, null, {
      skip: page * limit,
      limit: limit,
    }).sort({ createdAt: -1 });
    userPosts.sort((a, b) => {
      return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
    });
    const posts = await Promise.all(
      userPosts.map(async (post) => {

        return {
          _id: post._id,
          userId: post.userId,
          postBody: post.postBody,
          numLikes: post.likes.length,
          numComments: post.comments.length,
          isLiked: post.likes.includes(req.userId),
          createdAt: post.createdAt,
          fullname: user.fullname,
          username: user.username,
          profilePicture: user.img || "default-pfp.jpg",
        };
      })
    );
    res.status(200).json({ numFound: posts.length, posts: posts });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const bookmarkPost = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!user.bookmarks.includes(req.params.id)) {
      await user.updateOne({ $push: { bookmarks: req.params.id } });
      res.status(200).json({ message: "Post has been bookmarked" });
    } else {
      await user.updateOne({ $pull: { bookmarks: req.params.id } });
      res.status(200).json({ message: "Post has been unbookmarked" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createNewPost,
  editPost,
  deletePost,
  likePost,
  getTimelinePosts,
  getPostsByUsername,
  getPostById,
  bookmarkPost,
};
