const User = require("../models/User");
const fs = require("fs");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const bcrypt = require("bcrypt");

const changeProfilePicture = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You can only change your own profile picture" });
  }

  const updates = {
    img: {
      data: fs.readFileSync("images/" + req.file.filename),
      contentType: "image/png",
    },
  };

  User.findByIdAndUpdate(
    req.body.userId,
    updates,
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        let profilePicture;
        const buffer = Buffer.from(result.img.data);
        const b64String = buffer.toString("base64");
        profilePicture = `data:image/png;base64,${b64String}`;
        return res.status(200).json(profilePicture);
      }
    }
  );
};

const editUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You can only update your own account" });
  }

  const user = await User.findById(req.params.id);

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const updates = {
    fullname: req.body.fullname,
    username: req.body.username,
  };

  User.findByIdAndUpdate(
    req.body.userId,
    updates,
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        let profilePicture;
        const buffer = Buffer.from(result.img.data);
        const b64String = buffer.toString("base64");
        profilePicture = `data:image/png;base64,${b64String}`;
        const user = {
          ...result.toJSON(),
          img: profilePicture,
        };
        return res.status(200).json(user);
      }
    }
  );
};

const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    let profilePicture;
    if (user.img.data) {
      const buffer = Buffer.from(user.img.data);
      const b64String = buffer.toString("base64");
      profilePicture = `data:image/png;base64,${b64String}`;
    } else {
      profilePicture = "/default-pfp.jpg";
    }

    const mainUser = {
      ...user.toJSON(),
      img: profilePicture,
    };

    res.status(200).json(mainUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

const followUser = async (req, res) => {
  if (req.params.username === req.body.currUsername) {
    return res.status(403).json({ message: "You cannot follow yourself" });
  }
  try {
    const user = await User.findOne({ username: req.params.username });
    const currUser = await User.findOne({ username: req.body.currUsername });
    if (!user.followers.includes(currUser._id)) {
      await user.updateOne({ $push: { followers: currUser._id.toString() } });
      await currUser.updateOne({ $push: { following: user._id.toString() } });
      res.status(200).json("User has been followed");
    } else {
      await user.updateOne({ $pull: { followers: currUser._id.toString() } });
      await currUser.updateOne({ $pull: { following: user._id.toString() } });
      res.status(200).json("User has been unfollowed");
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getUnfollowedUsers = async (req, res) => {
  try {
    const users = await User.find({
      followers: { $nin: req.params.id },
      _id: { $nin: req.params.id },
    });

    const unfollowedUsers = users.map((user) => {
      let profilePicture;
      if (user.img.data) {
        const buffer = Buffer.from(user.img.data);
        const b64String = buffer.toString("base64");
        profilePicture = `data:image/png;base64,${b64String}`;
      } else {
        profilePicture = "/default-pfp.jpg";
      }

      return {
        ...user.toJSON(),
        img: profilePicture,
      };
    });

    res.status(200).json(unfollowedUsers);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFollowedUsers = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });
    const users = await User.find({
      followers: user._id.toString(),
    });

    const following = users.map((user) => {
      let profilePicture;
      if (user.img.data) {
        const buffer = Buffer.from(user.img.data);
        const b64String = buffer.toString("base64");
        profilePicture = `data:image/png;base64,${b64String}`;
      } else {
        profilePicture = "/default-pfp.jpg";
      }

      return {
        ...user.toJSON(),
        img: profilePicture,
      };
    });

    res.status(200).json({
      user: {
        fullname: user.fullname,
        username: user.username,
      },
      following: following,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFollowers = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });
    const users = await User.find({
      following: user._id.toString(),
    });

    const followers = users.map((user) => {
      let profilePicture;
      if (user.img.data) {
        const buffer = Buffer.from(user.img.data);
        const b64String = buffer.toString("base64");
        profilePicture = `data:image/png;base64,${b64String}`;
      } else {
        profilePicture = "/default-pfp.jpg";
      }

      return {
        ...user.toJSON(),
        img: profilePicture,
      };
    });

    res.status(200).json({
      user: {
        fullname: user.fullname,
        username: user.username,
      },
      followers: followers,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log("START");
    const user = await User.findById(req.params.userId);

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Array of post IDs from user's posts
    const postIds = await Post.find({ userId: req.params.userId })
      .select("_id")
      .then((res) => res.map((val) => val._id.toString()));
    const commentIds = await Comment.find({ userId: req.params.userId })
      .select("_id")
      .then((res) => res.map((val) => val._id.toString()));
    // REMOVE commentId from posts
    await Post.updateMany({ comments: { $in: commentIds } }, { $pull: { comments: { $in: commentIds } } })
    // DELETE comments from the user
    await Comment.deleteMany({ userId: req.params.userId });
    // DELETE comments from user's posts
    await Comment.deleteMany({ parentId: { $in: postIds } });
    // DELETE user's posts
    await Post.deleteMany({ _id: { $in: postIds } });
    // DELETE user
    await user.deleteOne();
    console.log("DONE");
    res.status(200).json({ message: "User account has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  changeProfilePicture,
  editUser,
  getUserByUsername,
  followUser,
  getUnfollowedUsers,
  getFollowedUsers,
  getFollowers,
  deleteUser,
};