import { Router } from 'express';
import { getProfile, signIn, signOut, signUp } from '../controllers/auth.controller.js';
import { isSignedIn } from '../middlewares/auth.middleware.js';
const router = Router();

router.post('/signup', signUp);
router.post('/login', signIn);
router.get('/logout', signOut);
router.get('/profile',[isSignedIn],getProfile)

export default router;