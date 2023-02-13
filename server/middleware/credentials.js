const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  console.log("ORIGIN", origin);
  console.log("ALLOWED ORIGINS", allowedOrigins);
  if (allowedOrigins.includes(origin)) {
    console.log("ORIGIN IS ALLOWED");
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
