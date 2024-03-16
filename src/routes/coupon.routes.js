import { Router } from 'express';
import {
	createCoupon,
	getAllCoupon,
	deleteCoupon,
	updateCoupon,
} from '../controllers/coupon.controller.js';
import { isSignedIn, authorize } from '../middlewares/auth.middleware.js';
import AuthRoles from '../utils/authRoles.js';
const router = Router();

router.post(
	'/',
	isSignedIn,
	authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
	createCoupon
);
router.delete(
	'/:id',
	isSignedIn,
	authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
	deleteCoupon
);
router.put(
	'action/:id',
	isSignedIn,
	authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
	updateCoupon
);
router.get(
	'/',
	isSignedIn,
	authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
	getAllCoupon
);

export default router;
