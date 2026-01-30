const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const SocialPostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    comments: [{ userId: { type: mongoose.Schema.Types.ObjectId }, content: String, createdAt: { type: Date, default: Date.now } }]
});

const SocialPost = mongoose.model('SocialPost', SocialPostSchema);

// Create a new post
router.post('/posts', async (req, res) => {
    try {
        const { userId, content } = req.body;
        const newPost = new SocialPost({ userId, content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await SocialPost.find().populate('userId', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
});

// Add a comment to a post
router.post('/posts/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, content } = req.body;
        const post = await SocialPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        post.comments.push({ userId, content });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
});

// Get comments for a post
router.get('/posts/:postId/comments', async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await SocialPost.findById(postId).populate('comments.userId', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post.comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
});

module.exports = router;