require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const authRouter = require("./routes/auth");
const refreshRouter = require("./routes/refresh")
const logoutRouter = require("./routes/logout")
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");

app.use(credentials)
app.use(cors(corsOptions));

// Routing
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/refresh", refreshRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

module.exports = app