// Signup controller

import User from '../models/user.schema.js';
import asyncHandler from '../service/asyncHandler.js';
import CustomError from '../utils/CustomError.js';

export const cookieOptions = {
	expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
	httpOnly: true,
};

//Signup a new user
export const signUp = asyncHandler(async (req, res) => {
	// get the data from the request body or user
	const { name, email, password } = req.body;

	// validate the data
	if (!name || !email || !password) {
		throw new CustomError('Please provide all the required fields', 400);
	}

	if (password.length < 8) {
		throw new CustomError('Password should be at least 8 characters long', 400);
	}

	if (!email.includes('@')) {
		throw new CustomError('Please provide a valid email', 400);
	}

	// check if user already exists
	const existingUser = await User.findOne({ email });

	if (existingUser) {
		throw new CustomError('User already exists', 400);
	}

	// create the user
	const user = await User.create({ name, email, password });
	const token = user.getJWTtoken();
	user.password = undefined;

	// store the token in the user's cookie
	res.cookie('token', token, cookieOptions);

	// send the response to the user
	res.status(200).json({ success: true, user, token });
});
