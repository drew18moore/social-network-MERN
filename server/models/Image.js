const mongoose = require("mongoose");

const Image = new mongoose.Schema({
  userId: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Image", Image);
