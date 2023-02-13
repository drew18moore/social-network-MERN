const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleRegister = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      fullname: req.body.fullname,
      username: req.body.username,
      password: hashedPassword,
    });

    const newUser = await user.save();
    res.status(200).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      res.status(403).json({ message: "Account already in use" });
    }
  }
};

const handleLogin = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "15s" }
    );

    user.refreshToken = refreshToken;
    await user.save();

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
      accessToken,
    };
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { handleRegister, handleLogin };
