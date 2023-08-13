import express, { Router } from "express";
import { handleRefreshToken } from "../controllers/refreshTokenController";

const refreshRouter: Router = express.Router()
refreshRouter.get("/", handleRefreshToken);

export default refreshRouter
