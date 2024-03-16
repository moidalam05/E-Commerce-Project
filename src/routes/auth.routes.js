import { Router } from 'express';
import {
	forgotPassword,
	getProfile,
	resetPassword,
	signIn,
	signOut,
	signUp,
} from '../controllers/auth.controller.js';
import { isSignedIn } from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/signup', signUp);
router.post('/login', signIn);
router.get('/logout', signOut);

router.post('/password/forgot', forgotPassword);
router.post('/password/reset/:token', resetPassword);

router.get('/profile', isSignedIn, getProfile);

export default router;
