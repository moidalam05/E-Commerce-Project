import { Router } from 'express';
import {
	addProduct,
	deleteProduct,
	getAllProducts,
	getProduct,
	getProductsByCollectionId,
} from '../controllers/product.controller.js';
import { isSignedIn, authorize } from '../middlewares/auth.middleware.js';
import AuthRoles from '../utils/authRoles.js';
const router = Router();

router.post(
	'/',
	isSignedIn,
	authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
	addProduct
);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.get('/collection/:id', getProductsByCollectionId);
router.delete(
	'/:id',
	isSignedIn,
	authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
	deleteProduct
);

export default router;
