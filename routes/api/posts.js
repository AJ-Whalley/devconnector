const express = require("express");
const router = express.Router();
const passport = require("passport");

//Load user model
const User = require("../../models/User");
const Post = require("../../models/Post");

//Load input validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts
// @desc    GET post
// @access  Public
router.get("/", (req, res) => {
  const errors = {};
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      errors.post = "There are no current posts";
      res.status(404).json(errors);
    });
});

// @route   GET api/posts/:id
// @desc    GET specific post
// @access  Public
router.get("/:id", (req, res) => {
  const errors = {};
  Post.findById(req.params.id)
    .then(post => {
      res.json(post);
    })
    .catch(err => {
      errors.post = "That post does not exist";
      res.status(404).json(errors);
    });
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      errors.text = "There is no text for this post";
      res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(newPost => res.json(newPost));
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Post.findById(req.params.id)
      .then(post => {
        //Check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }
        //Delete
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => {
        errors.post = "No post found";
        res.status(404).json(errors);
      });
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Post.findById(req.params.id)
      .then(post => {
        //Check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }
        //Delete
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => {
        errors.post = "No post found";
        res.status(404).json(errors);
      });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "User already liked this post" });
        }
        post.likes.unshift({ user: req.user.id });
        post.save().then(res.json(post));
      })
      .catch(err => {
        errors.post = "No post found";
        res.status(404).json(errors);
      });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Like post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "You have not yet liked this post" });
        }
        // Get remove index
        post.likes.splice(
          post.likes.findIndex(like => like._id === req.user.id),
          1
        );
        post.save().then(post => res.json(post));
      })
      .catch(err => {
        errors.post = "No post found";
        res.status(404).json(errors);
      });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Comment on post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          user: req.user.id,
          text: req.body.text,
          name: req.body.name
        };

        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => {
        errors.post = "No post found";
        res.status(404).json(errors);
      });
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        post.comments.splice(
          post.comments.findIndex(comment => comment._id === req.params._id),
          1
        );
        post.save().then(post => res.json(post));
      })
      .catch(err => {
        errors.post = "No post found";
        res.status(404).json(errors);
      });
  }
);

module.exports = router;
