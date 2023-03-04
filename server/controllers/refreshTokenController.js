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
        if (err || user._id.toString() !== decoded.userId)
          return res.status(403).json({ message: "Forbidden" });
        const accessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 900000 } // 15 mins
        );
        res.status(200).json({ accessToken });
      }
    );

  } catch (err) {
    console.error(err);
  }
};

module.exports = { handleRefreshToken }