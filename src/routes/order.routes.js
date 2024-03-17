import { Router } from 'express';
import {
	generateRazorpayOrderId,
	generateOrder,
	getMyOrders,
	getAllOrders,
	updateOrderStatus,
	deleteOrder,
} from '../controllers/order.controller.js';
import { isSignedIn, authorize } from '../middlewares/auth.middleware.js';
import AuthRoles from '../utils/authRoles.js';
const router = Router();

router.post('/razorpay', isSignedIn, generateRazorpayOrderId);
router.post('/', isSignedIn, generateOrder);
router.get('/', isSignedIn, getMyOrders);
router.get('/', isSignedIn, authorize(AuthRoles.ADMIN), getAllOrders);
router.put('/status/:id', isSignedIn, authorize(AuthRoles.ADMIN), updateOrderStatus);
router.delete('/:id', isSignedIn, authorize(AuthRoles.ADMIN), deleteOrder);

export default router;
