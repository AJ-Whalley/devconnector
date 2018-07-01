const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load input validation
const validateRegistrationInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Require in User model
const User = require("../../models/User");

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post("/registration", (req, res) => {
  const { errors, isValid } = validateRegistrationInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(savedUser => res.json(savedUser))
            .catch(err => console.log(err.message));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login a user
// @access  Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email.trim();
  const password = req.body.password.trim();

  User.findOne({
    email
  }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      } else {
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        JWT.sign(
          payload,
          keys.JWT_SECRET,
          {
            expiresIn: "10hr"
          },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      }
    });
  });
});

// @route   POST api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
