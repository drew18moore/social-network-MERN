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

router.post("/login", (req, res) => {
  res.send("Login")
})

module.exports = router