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

    let profilePicture;
    if (newPostUser.img.data) {
      const buffer = Buffer.from(newPostUser.img.data);
      const b64String = buffer.toString("base64");
      profilePicture = `data:image/png;base64,${b64String}`;
    } else {
      profilePicture = "/default-pfp.jpg";
    }
    const response = {
      userId: newPost.userId,
      postBody: newPost.postBody,
      likes: [],
      comments: [],
      _id: newPost._id,
      createdAt: newPost.createdAt,
      fullname: newPostUser.fullname,
      username: newPostUser.username,
      profilePicture: profilePicture,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" })
    const author = await User.findOne({ _id: post.userId });

    // get current user
    const currUser = await User.findById(req.userId);
    if (!currUser) return res.status(403).json({ message: "Forbidden" });

    let profilePicture;
    if (author.img.data) {
      const buffer = Buffer.from(author.img.data);
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
          commentBody: comment.commentBody,
          _id: comment._id,
          parentId: comment.parentId,
          fullname: commentUser.fullname,
          username: commentUser.username,
          profilePicture: commentProfilePicture,
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
      profilePicture: profilePicture,
      comments: comments,
      isBookmarked: currUser.bookmarks.includes(post._id)
    };

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
};

const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found" })
    if (post.userId !== req.userId) {
      return res.status(403).json("You can only update your own posts");
    }

    post.postBody = req.body.postBody;
    post.save();

    const postData = {
      _id: post._id,
      postBody: post.postBody,
    }
    return res.status(200).json(postData);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId !== req.userId) {
      return res
        .status(412)
        .json({ message: "You can only delete your own posts" });
    }
    if (post.comments.length) {
      await Comment.deleteMany({ _id: { $in: post.comments } });
    }
    // Remove postId from bookmarks
    await User.updateMany({ bookmarks: post._id.toString() }, { $pull: { bookmarks: post._id.toString() } });
    const response = await post.deleteOne();
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const likePost = async (req, res) => {
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
};

const getTimelinePosts = async (req, res) => {
  try {
    const page = req.query.page - 1;
    const { following } = await User.findById(req.params.userId);
    const allPosts = await Post.find(
      { userId: { $in: [req.params.userId, ...following] } },
      null,
      { skip: page * req.query.limit, limit: req.query.limit }
    ).sort({ createdAt: -1 });
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
    const userPosts = await Post.find({ userId: user._id }, null, {
      skip: page * limit,
      limit: limit,
    }).sort({ createdAt: -1 });
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
    res.status(200).json({ numFound: posts.length, posts: posts });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const bookmarkPost = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
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
}

module.exports = {
  createNewPost,
  editPost,
  deletePost,
  likePost,
  getTimelinePosts,
  getPostsByUsername,
  getPostById,
  bookmarkPost
};
