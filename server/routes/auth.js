const express = require("express")
const router = express.Router()
const User = require("../models/User")

router.post("/register", async (req, res) => {
  const user = new User({
    fullname: req.body.fullname,
    username: req.body.username,
    password: req.body.password
  })

  try {
    const newUser = await user.save()
    res.status(200).json(newUser)
  } catch (err) {
    if (err.code === 11000) {
      res.status(403).json({ message: "Account already in use" })
    }
  }
})

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username, 
      password: req.body.password
    })

    !user && res.status(404).json({ message: "user not found" })

    const buffer = Buffer.from(user.img.data)
    const b64String = buffer.toString("base64")
    let newUser = {
      ...user.toJSON(),
      img: `data:image/png;base64,${b64String}`
    }
    res.status(200).json(newUser)
  } catch (err) {
    console.log(err);
  }
})

module.exports = router