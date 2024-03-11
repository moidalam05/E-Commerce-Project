import User from '../models/user.schema.js';
import JWT from 'jsonwebtoken';
import asynceHandler from '../service/asyncHandler.js';
import config from '../config/index.js';
import CustomError from '../utils/CustomError.js';

export const isSignedIn = asynceHandler(async (req, res, next) => {
	let token;
	if (
		req.cookies.token ||
		(req.headers.authorization && req.header.authorization.startwith('Bearer'))
	) {
		token = req.cookies.token || req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		throw new CustomError('Not authorized to access this route', 401);
	}

	try {
		JWT.verify(token, config.JWT_SECRET, async (err, decoded) => {
			if (err) {
				throw new CustomError('Not authorized to access this route', 401);
			}
			req.user = await User.findById(decoded._id, 'name email role');
			next();
		});
	} catch (error) {
		throw new CustomError('Not authorized to access this route', 401);
	}
});

export const authorize = (...requiredRoles) =>
	asynceHandler(async (req, res, next) => {
		if (!requiredRoles.includes(req.user.role)) {
			throw new CustomError('Not authorized to access this route', 401);
		}
		next();
	});
