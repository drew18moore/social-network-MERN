const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  postBody: {
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

module.exports = mongoose.model("Post", PostSchema);
