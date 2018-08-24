const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../config/keys");

const User = require("../models/user");

// @route   GET /api/users/
// @desc    Get all users
// @access  Public
router.get("/users", (req, res) =>
  User.find()
    .then(foundUsers => res.json(foundUsers))
    .catch(error => res.status(500).json({ error }))
);

// @route   POST /api/users/
// @desc    Create or register new user
// @access  Public
router.post("/users", (req, res) => {
  // const { errors, isValid } = validate(req.body, )
  if (!req.body.email)
    return res.status(400).json({ email: "Please fill email address" });
  if (!req.body.password)
    return res.status(400).json({ password: "Please fill email address" });

  User.findOne({ email: req.body.email }).then(foundUser => {
    if (foundUser) {
      return res.status(400).json({ email: "Email already exists" });
    }
    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        return res.status(500).json({ error });
      }
      bcrypt.hash(newUser.password, salt, (error, hash) => {
        if (error) {
          return res.status(500).json({ error });
        }
        newUser.password = hash;
        newUser
          .save()
          .then(createdUser =>
            User.findById(createdUser.id).then(foundUser => res.json(foundUser))
          )
          .catch(error => res.status(500).json({ error }));
      });
    });
  });
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Public
router.get("/users/:id", (req, res) => {
  User.findById(req.params.id)
    .then(foundUser => {
      if (!foundUser) {
        return res.status(404).end();
      }
      return res.json(foundUser);
    })
    .catch(error => res.status(500).json({ error }));
});

// @route   POST /api/authenticate
// @desc    Authenticate user with given credentials
// @access  Public
router.post("/authenticate", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, "+password").then(foundUser => {
    if (!foundUser) {
      return res.status(400).end();
    }
    bcrypt
      .compare(password, foundUser.password)
      .then(isMatch => {
        if (!isMatch) {
          return res.status(400).end();
        }
        const payload = {
          id: foundUser.id,
          email: foundUser.email
        };
        jwt.sign(
          payload,
          keys.SECRET,
          { expiresIn: 3600 },
          (error, accessToken) => {
            if (error) {
              return res.status(500).json({ error });
            }
            return res.json({ accessToken });
          }
        );
      })
      .catch(() => res.status(400).end());
  });
});

// @route   GET /api/whoami
// @desc    Return current user
// @access  Private
router.get(
  "/whoami",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(400).end();
    }
    User.findById(req.user.id)
      .then(foundUser => res.json(foundUser))
      .catch(error => res.status(400).json({ error }));
  }
);

module.exports = router;
