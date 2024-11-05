import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { changePassword, followUnFollowUsers, getProfile, getSuggestedUsers, updateProfileImage, updateUserProfile } from '../controllers/user.controller.js';

const router= express.Router();

router.get('/profile/:username',protectRoute, getProfile)
router.post('/follow/:id',protectRoute, followUnFollowUsers)
router.get('/suggested',protectRoute, getSuggestedUsers)
router.put('/update', protectRoute, updateUserProfile)
router.put('/change-password', protectRoute, changePassword)
router.put('/change-image', protectRoute, updateProfileImage)

export default router