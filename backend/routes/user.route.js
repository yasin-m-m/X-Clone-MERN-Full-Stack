import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { followUnFollowUsers, getProfile } from '../controllers/user.controller.js';

const router= express.Router();

router.get('/profile/:username',protectRoute, getProfile)
router.post('/follow/:id',protectRoute, followUnFollowUsers)

export default router