const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const Image = require("../models/Image");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Change profile picture
router.put("/change-img/:id", upload.single("image"), async (req, res) => {
  if (req.body.userId !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You can only change your own profile picture" });
  }

  const updates = {
    img: {
      data: fs.readFileSync("images/" + req.file.filename),
      contentType: "image/png",
    },
  };

  User.findByIdAndUpdate(
    req.body.userId,
    updates,
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        let profilePicture;
        const buffer = Buffer.from(result.img.data);
        const b64String = buffer.toString("base64");
        profilePicture = `data:image/png;base64,${b64String}`;
        return res.status(200).json(profilePicture);
      }
    }
  );
});

// Edit user info
router.put("/:id", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    return res
      .status(403)
      .json({ message: "You can only update your own account" });
  }

  const updates = {
    fullname: req.body.fullname,
    username: req.body.username,
  };

  User.findByIdAndUpdate(
    req.body.userId,
    updates,
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        let profilePicture;
        const buffer = Buffer.from(result.img.data);
        const b64String = buffer.toString("base64");
        profilePicture = `data:image/png;base64,${b64String}`;
        const user = {
          ...result.toJSON(),
          img: profilePicture,
        };
        return res.status(200).json(user);
      }
    }
  );
});

// Get user by unique username
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    let profilePicture;
    if (user.img.data) {
      const buffer = Buffer.from(user.img.data);
      const b64String = buffer.toString("base64");
      profilePicture = `data:image/png;base64,${b64String}`;
    } else {
      profilePicture = "/default-pfp.jpg";
    }

    const mainUser = {
      ...user.toJSON(),
      img: profilePicture,
    };

    res.status(200).json(mainUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Follow user
router.put("/follow/:username", async (req, res) => {
  if (req.params.username === req.body.currUsername) {
    return res.status(403).json({ message: "You cannot follow yourself" })
  }
  try {
    const user = await User.findOne({ username: req.params.username });
    const currUser = await User.findOne({ username: req.body.currUsername })
    if (!user.followers.includes(currUser._id)) {
      await user.updateOne({ $push: { followers: currUser._id.toString() } });
      await currUser.updateOne({ $push: { following: user._id.toString() } })
      res.status(200).json("User has been followed");
    } else {
      await user.updateOne({ $pull: { followers: currUser._id.toString() } })
      await currUser.updateOne({ $pull: { following: user._id.toString() } })
      res.status(200).json("User has been unfollowed");
    }
  } catch (err) {
    res.status(500).json({ message: err});
  }
});
module.exports = router;
