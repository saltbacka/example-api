const express = require("express");
const router = express.Router();

// @route   GET /api/users/
// @desc    Get all users route
// @access  Public
router.get("/", () => console.log("GET /"));

// @route   POST /api/users/
// @desc    Create or register new user route
// @access  Public
router.post("/", (req, res) => {
  return res.json({ foo: "bar" });
});

// @route   GET /api/users/:id
// @desc    Get single user route
// @access  Public
router.get("/:id", (req, res) => {
  return res.json({ foo: "bar" });
});

module.exports = router;
