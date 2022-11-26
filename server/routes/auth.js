const express = require("express")
const router = express.Router()
const User = require("../models/User")

router.post("/register", async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  try {
    const newUser = await user.save()
    res.status(200).json(newUser)
  } catch (err) {
    console.log(err);
  }
})

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username, 
      password: req.body.password
    })

    res.status(200).json(user)
  } catch (err) {
    console.log(err);
  }
})

module.exports = router