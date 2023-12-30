// Create web server

var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');

// Create a new comment
router.post('/', function(req, res, next) {
  var comment = new Comment({
    content: req.body.content,
    post: req.body.post,
    user: req.body.user
  });

  comment.save(function(err, comment) {
    if (err) {
      return next(err);
    }

    Post.findById(comment.post, function(err, post) {
      if (err) {
        return next(err);
      }

      post.comments.push(comment._id);
      post.save(function(err) {
        if (err) {
          return next(err);
        }

        res.status(201).json({
          comment: comment
        });
      });
    });
  });
});

// Get all comments for a post
router.get('/:postId', function(req, res, next) {
  Comment.find({
    post: req.params.postId
  })
  .sort('-createdAt')
  .exec(function(err, comments) {
    if (err) {
      return next(err);
    }

    res.status(200).json({
      comments: comments
    });
  });
});

// Delete comment
router.delete('/:id', function(req, res, next) {
  Comment.findByIdAndRemove(req.params.id, function(err, comment) {
    if (err) {
      return next(err);
    }

    Post.findById(comment.post, function(err, post) {
      if (err) {
        return next(err);
      }

      post.comments.splice(post.comments.indexOf(comment._id), 1);
      post.save(function(err) {
        if (err) {
          return next(err);
        }

        res.status(200).json({
          comment: comment
        });
      });
    });
  });
});

module.exports = router;

// finish?
