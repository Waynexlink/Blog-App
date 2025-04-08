// src/routes/authRoute.js
const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout); // GET for simplicity, POST often preferred

// Example of a protected route (e.g., getting current user profile)
// router.get('/me', authController.protect, userController.getMe); // Needs a userController

module.exports = router;
