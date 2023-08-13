import { Request, Response } from "express";
import User from "../models/User";

export const handleLogout = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(204);
    }

    // Delete refresh token from db
    user.refreshToken = "";
    user.save();

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
  }
};
