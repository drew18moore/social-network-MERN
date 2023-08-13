import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const handleRegister = async (req: Request, res: Response) => {
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
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 900000 } // 15 mins
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
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
      bio: savedUser.bio,
    };

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(newUser);
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(403).json({ message: "Account already in use" });
    }
  }
};

export const handleLogin = async (req: Request, res: Response) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({
          message:
            "Missing required data. Username and password are required.",
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
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 900000 }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    let newUser = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      following: user.following,
      followers: user.followers,
      img: user.img || "default-pfp.jpg",
      accessToken,
      bio: user.bio,
    };
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
  }
};

export const handlePersistentLogin = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Forbidden" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (err: any, decoded: any) => {
        if (err || user._id.toString() !== decoded.userId)
          return res.status(403).json({ message: "Forbidden" });
        const accessToken = jwt.sign(
          { userId: decoded.userId },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: 900000 } // 15 mins
        );

        let newUser = {
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
          following: user.following,
          followers: user.followers,
          img: user.img || "default-pfp.jpg",
          accessToken,
          bio: user.bio,
        };
        res.status(200).json(newUser);
      }
    );
  } catch (err) {
    console.error(err);
  }
};
