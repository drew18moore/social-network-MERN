import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import refreshRouter from "./routes/refresh";
import logoutRouter from "./routes/logout";
import postsRouter from "./routes/posts";
import usersRouter from "./routes/users";
import commentsRouter from "./routes/comments";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions";
import { credentials } from "./middleware/credentials";

const app = express();

app.use(credentials);
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

export default app;
