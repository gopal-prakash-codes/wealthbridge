const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const SocialPostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const SocialPost = mongoose.model('SocialPost', SocialPostSchema);

// Create a new social post
router.post('/posts', async (req, res) => {
    const { userId, content } = req.body;
    if (!userId || !content) {
        return res.status(400).json({ error: 'User ID and content are required' });
    }

    try {
        const newPost = new SocialPost({ userId, content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all social posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await SocialPost.find().populate('userId', 'username');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific post by ID
router.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await SocialPost.findById(id).populate('userId', 'username');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a post
router.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await SocialPost.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;