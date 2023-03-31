const Comment = require("../models/Comment");
const Post = require("../models/Post");

const newComment = async (req, res) => {
  if (req.body.commentBody === "") {
    return res.status(412).json({ message: "You must type a message." });
  }

  const comment = new Comment({
    userId: req.userId,
    parentId: req.body.parentId,
    commentBody: req.body.commentBody,
  });

  try {
    const newComment = await comment.save();
    const post = await Post.findById(req.body.parentId);
    post.comments.unshift(newComment._id.toString());
    await post.save();
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId !== req.body.userId) {
      return res.status(403).json("You can only update your own comments");
    }
    comment.commentBody = req.body.postBody;
    comment.save();
    return res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const parentPost = await Post.findById(req.body.parentId);

    if (comment.userId !== req.body.userId) {
      return res
        .status(412)
        .json({ message: "You can only delete your own comments" });
    }

    await parentPost.updateOne({ $pull: { comments: req.params.id } });
    const response = await comment.deleteOne();

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const numLikes = comment.likes.length;
    if (!comment.likes.includes(req.userId)) {
      await comment.updateOne({ $push: { likes: req.userId } });
      res
        .status(200)
        .json({ message: "Post has been liked", numLikes: numLikes + 1 });
    } else {
      await comment.updateOne({ $pull: { likes: req.userId } });
      res
        .status(200)
        .json({ message: "Post has been unliked", numLikes: numLikes - 1 });
    }
  } catch {
    res.status(500).json({ message: err });
  }
};

module.exports = { newComment, editComment, deleteComment, likeComment };
