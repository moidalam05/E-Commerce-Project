import { Router } from 'express';
import authRoutes from './auth.routes.js';
import couponRoutes from './coupon.routes.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/coupon',couponRoutes );


export default router;