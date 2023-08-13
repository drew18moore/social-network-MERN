import { handleLogout } from "../controllers/logoutController";

import express, { Router } from "express";
const logoutRouter: Router = express.Router()

logoutRouter.get("/", handleLogout);

export default logoutRouter;
