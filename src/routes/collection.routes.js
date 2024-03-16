import { Router } from 'express';
import {
	createCollection,
	deleteCollection,
	updateCollection,
	getAllCollections,
	getCollection,
} from '../controllers/collection.controller.js';
import { isSignedIn, authorize } from '../middlewares/auth.middleware.js';
import AuthRoles from '../utils/authRoles.js';
const router = Router();

router.post(
	'/',
	isSignedIn,
	authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
	createCollection
);

router.get('/', getAllCollections);

router.put(
	'/:id',
	isSignedIn,
	authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
	updateCollection
);

router.delete(
	'/:id',
	isSignedIn,
	authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR),
	deleteCollection
);

router.get('/:id', getCollection);

export default router;
