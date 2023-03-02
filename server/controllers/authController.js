const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleRegister = async (req, res) => {
  try {
    if (!req.body.fullname || !req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({
          message:
            "Missing required data. Fullname, username, and password are required.",
        });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      fullname: req.body.fullname,
      username: req.body.username,
      password: hashedPassword,
    });

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 900000 } // 15 mins
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    const savedUser = await user.save();

    let newUser = {
      _id: savedUser._id,
      fullname: savedUser.fullname,
      username: savedUser.username,
      following: savedUser.following,
      followers: savedUser.followers,
      accessToken,
    };

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      res.status(403).json({ message: "Account already in use" });
    }
  }
};

const handleLogin = async (req, res) => {
  try {
    if (!req.body.fullname || !req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({
          message:
            "Missing required data. Fullname, username, and password are required.",
        });
    }
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
      { expiresIn: 900000 }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
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
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      following: user.following,
      followers: user.followers,
      img: profilePicture,
      accessToken,
    };
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
  }
};

const handlePersistentLogin = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Forbidden" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || user.username !== decoded.username)
          return res.status(403).json({ message: "Forbidden" });
        const accessToken = jwt.sign(
          { username: decoded.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 900000 } // 15 mins
        );

        let profilePicture;
        if (user.img.data) {
          const buffer = Buffer.from(user.img.data);
          const b64String = buffer.toString("base64");
          profilePicture = `data:image/png;base64,${b64String}`;
        } else {
          profilePicture = "/default-pfp.jpg";
        }

        let newUser = {
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
          following: user.following,
          followers: user.followers,
          img: profilePicture,
          accessToken,
        };
        res.status(200).json(newUser);
      }
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = { handleRegister, handleLogin, handlePersistentLogin };
