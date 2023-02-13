const jwt = require("jsonwebtoken");
const User = require("../models/User");

const handleRefreshToken = async (req, res) => {
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
          return res.status(403).json({ message: "Forbidden1" });
        const accessToken = jwt.sign(
          { username: decoded.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        res.status(200).json({ accessToken });
      }
    );

  } catch (err) {
    console.error(err);
  }
};

module.exports = { handleRefreshToken }