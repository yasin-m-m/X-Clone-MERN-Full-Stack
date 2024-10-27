import express from 'express';
import { getMe, logIn, logOut, signUp } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/getMe',protectRoute, getMe)
router.post('/signUp', signUp)
router.post('/logIn', logIn)
router.post('/logOut', logOut)


export default router