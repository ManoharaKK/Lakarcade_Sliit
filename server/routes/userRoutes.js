const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Login user
router.post("/login", userController.loginUser);

// Create user (signup)
router.post("/", userController.createUser);

// Get all users
router.get("/", userController.getUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Update user
router.patch("/:id", userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
