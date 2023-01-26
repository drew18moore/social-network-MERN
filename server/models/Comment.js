const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    required: true,
  },
  commentBody: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
  comments: {
    type: Array,
    defalut: [],
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
