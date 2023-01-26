const Comment = require("../models/Comment");
const Post = require("../models/Post");

const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.userId !== req.body.userId) {
      return res.status(403).json("You can only update your own comments");
    }

    const updates = {
      commentBody: req.body.postBody,
    };

    Comment.findByIdAndUpdate(
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
}

const deleteComment = async (req, res) => {
  try {
    console.log(req.body.parentId)
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
}

module.exports = { editComment, deleteComment }