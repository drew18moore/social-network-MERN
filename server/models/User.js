const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    unique: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  following: {
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
  refreshToken: {
    type: String,
  },
  bookmarks: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("User", UserSchema);
