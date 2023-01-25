const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController")

// CREATE account
router.post("/register", authController.handleRegister);

// GET user by username and password
router.post("/login", authController.handleLogin);

module.exports = router;
