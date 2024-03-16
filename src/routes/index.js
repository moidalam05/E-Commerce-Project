import { Router } from 'express';
import authRoutes from './auth.routes.js';
import couponRoutes from './coupon.routes.js';
import collectionRoutes from './collection.routes.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/coupon',couponRoutes );
router.use('/collection',collectionRoutes );


export default router;