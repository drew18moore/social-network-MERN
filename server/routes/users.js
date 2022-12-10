const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../images')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage})

router.post("/upload", upload.single("image"), (req, res) => {
  res.send("Image Uploaded")
})

router.put("/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    return res.status(403).json({ message: "You can only update your own account" })
  }

  const updates = {
    fullname: req.body.fullname,
    username: req.body.username,
  }

  User.findByIdAndUpdate(req.body.userId, updates, { new: true }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err });
    } else {
      return res.status(200).json(result)
    }
  })
})

module.exports = router;