import { Router } from 'express';
import authRoutes from './auth.routes.js';
import couponRoutes from './coupon.routes.js';
import collectionRoutes from './collection.routes.js';
import orderRoutes from './order.routes.js';
import productRoutes from './product.routes.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/coupon',couponRoutes );
router.use('/collection', collectionRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);


export default router;