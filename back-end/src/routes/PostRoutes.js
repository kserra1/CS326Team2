import express from 'express';
import PostController from './PostController.js';

const router = express.Router();

// Route to like a post
router.post('/like', (req, res) => PostController.likePost(req, res));

// Route to add a comment to a post
router.post('/comment', (req, res) => PostController.addComment(req, res));

// Route to delete a post
router.delete('/:postId', (req, res) => PostController.deletePost(req, res));

// Route to get a specific post
router.get('/:postId', (req, res) => PostController.getPost(req, res));

// Route to get all posts
router.get('/', (req, res) => PostController.getAllPosts(req, res));

export default router;