const User = require("../models/User");
const fs = require("fs");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const bcrypt = require("bcrypt");

const editUser = async (req, res) => {
  if (req.userId !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You can only update your own account" });
  }

  const user = await User.findById(req.params.id);

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  user.fullname = req.body.fullname;
  user.username = req.body.username;
  user.bio = req.body.bio;
  user.img = req.body.img;
  user.save();

  const updatedUserData = {
    fullname: user.fullname,
    username: user.username,
    bio: user.bio,
    img: user.img,
  };
  return res.status(200).json(updatedUserData);
};

const getUserByUsername = async (req, res) => {
  try {
    const authUserId = req.userId;
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" })

    const mainUser = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      numFollowing: user.following.length,
      numFollowers: user.followers.length,
      isFollowing: user.followers.includes(authUserId),
      img: user.img,
      bio: user.bio,
    };

    res.status(200).json(mainUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

const followUser = async (req, res) => {
  try {
    const authUser = await User.findById(req.userId);
    if (req.params.username === authUser.username) {
      return res.status(403).json({ message: "You cannot follow yourself" });
    }
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" })

    if (!user.followers.includes(authUser._id)) {
      await user.updateOne({ $push: { followers: authUser._id.toString() } });
      await authUser.updateOne({ $push: { following: user._id.toString() } });
      res.status(200).json("User has been followed");
    } else {
      await user.updateOne({ $pull: { followers: authUser._id.toString() } });
      await authUser.updateOne({ $pull: { following: user._id.toString() } });
      res.status(200).json("User has been unfollowed");
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getUnfollowedUsers = async (req, res) => {
  try {
    const page = req.query.page - 1 || 0;
    const limit = req.query.limit || 0;
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    const users = await User.find(
      {
        followers: { $nin: req.params.id },
        _id: { $nin: req.params.id },
      },
      null,
      { skip: page * limit, limit: limit }
    );

    const unfollowedUsers = users.map((user) => {

      return {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        img: user.img || "default-pfp.jpg",
      };
    });

    res.status(200).json({
      numFound: unfollowedUsers.length,
      unfollowedUsers: unfollowedUsers,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFollowedUsers = async (req, res) => {
  try {
    const page = req.query.page - 1 || 0;
    const limit = req.query.limit || 0;
    const currUser = await User.findOne({
      username: req.params.username,
    });
    if (!currUser) return res.status(404).json({ message: "User not found" })
    const users = await User.find(
      {
        followers: currUser._id.toString(),
      },
      null,
      { skip: page * limit, limit: limit }
    );

    const following = users.map((user) => {

      return {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        img: user.img || "default-pfp.jpg",
        isFollowing: user.followers.includes(currUser._id.toString()),
      };
    });

    res.status(200).json({
      user: {
        fullname: currUser.fullname,
        username: currUser.username,
      },
      numFound: following.length,
      following: following,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFollowers = async (req, res) => {
  try {
    const page = req.query.page - 1 || 0;
    const limit = req.query.limit || 0;
    const currUser = await User.findOne({
      username: req.params.username,
    });
    if (!currUser) return res.status(404).json({ message: "User not found" })
    const users = await User.find(
      {
        following: currUser._id.toString(),
      },
      null,
      { skip: page * limit, limit: limit }
    );

    const followers = users.map((user) => {

      return {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        img: user.img || "default-pfp.jpg",
        isFollowing: user.followers.includes(currUser._id.toString()),
      };
    });

    res.status(200).json({
      user: {
        fullname: currUser.fullname,
        username: currUser.username,
      },
      numFound: followers.length,
      followers: followers,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.userId !== req.params.userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own account" });
    }
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" })

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    // Get array of IDs of posts made by user and comments made by user
    const [postIds, commentIds] = await Promise.all([
      Post.find({ userId: req.params.userId })
        .select("_id")
        .then((res) => res.map((val) => val._id.toString())),
      Comment.find({ userId: req.params.userId })
        .select("_id")
        .then((res) => res.map((val) => val._id.toString())),
    ]);
    // Remove pointer from posts to user's comments and delete all user's comments
    await Promise.all([
      Post.updateMany(
        { comments: { $in: commentIds } },
        { $pull: { comments: { $in: commentIds } } }
      ),
      Comment.deleteMany({ userId: req.params.userId }),
    ]);
    // Delete comments on user's posts, delete user's posts, and remove user's post ids from other users' bookmarks
    await Promise.all([
      Comment.deleteMany({ parentId: { $in: postIds } }),
      Post.deleteMany({ _id: { $in: postIds } }),
      User.updateMany(
        { bookmarks: { $in: postIds } },
        { $pull: { bookmarks: { $in: postIds } } }
      ),
    ]);
    // Remove userId from other users' followers, following, post likes, and comment likes lists
    await Promise.all([
      User.updateMany(
        { followers: req.userId },
        { $pull: { followers: req.userId } }
      ),
      User.updateMany(
        { following: req.userId },
        { $pull: { following: req.userId } }
      ),
      Post.updateMany(
        { likes: req.userId },
        { $pull: { likes: req.userId }}
      ),
      Comment.updateMany(
        { likes: req.userId },
        { $pull: { likes: req.userId }}
      )
    ]);
    // DELETE user
    await user.deleteOne();
    res.status(200).json({ message: "User account has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getBookmarkedPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) - 1 || 0;
    const limit = Number(req.query.limit) || 0;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" })
    const bookmarksReversed = user.bookmarks.reverse();
    const postIds = bookmarksReversed.slice(page * limit, page * limit + limit);

    const bookmarkedPosts = await Promise.all(
      postIds.map(async (postId) => {
        const post = await Post.findById(postId);
        const postUser = await User.findById(post.userId);

        return {
          _id: post._id,
          userId: post.userId,
          postBody: post.postBody,
          likes: post.likes,
          comments: post.comments,
          createdAt: post.createdAt,
          fullname: postUser.fullname,
          username: postUser.username,
          profilePicture: postUser.img || "default-pfp.jpg",
        };
      })
    );

    res
      .status(200)
      .json({ numFound: bookmarkedPosts.length, posts: bookmarkedPosts });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  editUser,
  getUserByUsername,
  followUser,
  getUnfollowedUsers,
  getFollowedUsers,
  getFollowers,
  deleteUser,
  getBookmarkedPosts,
};
