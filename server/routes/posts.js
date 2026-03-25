const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// @route   GET api/posts
// @desc    Get all posts with pagination
// @access  Public
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Add current user's like status if token provided
    // (Optional enhancement based on frontend requirements)
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', [authMiddleware, upload.single('image')], async (req, res) => {
  try {
    if (!req.body.content || req.body.content.trim() === '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    const newPost = new Post({
      userId: req.user.id,
      username: req.user.username,
      content: req.body.content,
      image: req.file ? req.file.path : null
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST api/posts/:id/like
// @desc    Like/Unlike toggle
// @access  Private
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.find(l => l.username === req.user.username);

    if (alreadyLiked) {
      post.likes = post.likes.filter(l => l.username !== req.user.username);
    } else {
      post.likes.push({ username: req.user.username });
    }

    await post.save();
    res.json({ likes: post.likes, likesCount: post.likes.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/:id/comment
// @desc    Add a comment
// @access  Private
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      username: req.user.username,
      text: req.body.text
    };

    post.comments.push(newComment);
    await post.save();
    
    res.json(post.comments[post.comments.length - 1]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
