import { Request, Response } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";

export const newComment = async (req: Request, res: Response) => {
  if (req.body.commentBody === "" || !req.body.commentBody) {
    return res.status(400).json({ message: "You must type a message." });
  }

  if (!req.body.parentId)
    return res
      .status(400)
      .json({ message: "Missing parentId in request body" });
  const parentPost = await Post.findById(req.body.parentId);
  if (!parentPost)
    return res.status(404).json({ message: "Parent post not found" });

  const comment = new Comment({
    userId: req.userId,
    parentId: req.body.parentId,
    commentBody: req.body.commentBody,
  });

  try {
    const newComment = await comment.save();
    const post = await Post.findById(req.body.parentId);
    post!.comments.unshift(newComment._id.toString());
    await post!.save();
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const editComment = async (req: Request, res: Response) => {
  try {
    if (!req.body.postBody || req.body.postBody === "")
      return res
        .status(400)
        .json({ message: "Must provide commentBody in response" });
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.userId !== req.userId) {
      return res.status(403).json("You can only update your own comments");
    }
    comment.commentBody = req.body.postBody;
    comment.save();
    const response = {
      _id: comment._id,
      commentBody: comment.commentBody,
    }
    return res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    if (!req.body.parentId)
      return res
        .status(400)
        .json({ message: "parentId is missing from request body" });
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    const parentPost = await Post.findById(req.body.parentId);

    if (comment.userId !== req.userId) {
      return res
        .status(412)
        .json({ message: "You can only delete your own comments" });
    }

    await parentPost!.updateOne({ $pull: { comments: req.params.id } });
    const response = await comment.deleteOne();

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const likeComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
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
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
