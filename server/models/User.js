const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    unique: false
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("User", UserSchema)