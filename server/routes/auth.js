const express = require("express");
const router = express.Router();
const User = require("../models/User");

// CREATE account
router.post("/register", async (req, res) => {
  const user = new User({
    fullname: req.body.fullname,
    username: req.body.username,
    password: req.body.password,
  });

  try {
    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      res.status(403).json({ message: "Account already in use" });
    }
  }
});

// GET user by username and password
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    !user && res.status(404).json({ message: "User not found" });

    let profilePicture;
    if (user.img.data) {
      const buffer = Buffer.from(user.img.data);
      const b64String = buffer.toString("base64");
      profilePicture = `data:image/png;base64,${b64String}`;
    } else {
      profilePicture = "/default-pfp.jpg";
    }

    let newUser = {
      ...user.toJSON(),
      img: profilePicture,
    };
    res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
