import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { commentPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUsersPosts, likePost } from '../controllers/post.controller.js';

const router = express.Router()
router.get('/posts', protectRoute, getAllPosts)
router.get('/like/:id', protectRoute, getLikedPosts)
router.get('/following', protectRoute, getFollowingPosts)
router.get('/user/username', protectRoute, getUsersPosts)
router.post('/create', protectRoute, createPost)
router.post('/like/:id', protectRoute, likePost)
router.post('/comment/:id', protectRoute, commentPost)
router.delete('/delete/:id', protectRoute, deletePost)

export default router