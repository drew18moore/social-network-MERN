import express, { Router } from "express";
import { handleLogin, handlePersistentLogin, handleRegister } from "../controllers/authController";

const authRouter: Router = express.Router();
// CREATE account
authRouter.post("/register", handleRegister);

// GET user by username and password
authRouter.post("/login", handleLogin);

authRouter.get("/login/persist", handlePersistentLogin)

export default authRouter;
