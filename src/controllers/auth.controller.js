import User from '../models/user.schema.js';
import asyncHandler from '../service/asyncHandler.js';
import CustomError from '../utils/CustomError.js';

export const cookieOptions = {
	expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
	httpOnly: true,
};

/*******************************************************
 * @SIGNUP
 * @route http://localhost:5000/api/v1/auth/signup
 * @description Signup a new user
 * @returns {Object} - user, token
 *******************************************************/

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

/*******************************************************
 * @SIGNIN
 * @route http://localhost:5000/api/v1/auth/signin
 * @description Signin the user
 * @returns {Object} - user, token
 *******************************************************/

// Signin a user
export const signIn = asyncHandler(async (req, res) => {
	// get the data from the request body or user
	const { email, password } = req.body;

	// validate the data
	if (!email || !password) {
		throw new CustomError('Please provide all the required fields', 400);
	}
	if (!email.includes('@')) {
		throw new CustomError('Please provide a valid email', 400);
	}
	if (password.length < 8) {
		throw new CustomError('Password should be at least 8 characters long', 400);
	}

	// check if user exists
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		throw new CustomError('Invalid credentials', 401);
	}

	// check if email is matches
	if (user.email !== email) {
		throw new CustomError('Email is not correct !', 401);
	}

	// check if password matches
	const isPasswordMatched = await user.comparePassword(password);
	if (!isPasswordMatched) {
		throw new CustomError('Password is not correct !', 401);
	}

	// generate token and send the response
	const token = user.getJWTtoken();
	user.password = undefined;
	res.cookie('token', token, cookieOptions);
	res.status(200).json({ success: true, user, token });
});

/*******************************************************
 * @SIGNOUT
 * @route http://localhost:5000/api/v1/auth/signout
 * @description Signout the user
 * @returns {Object} - message
 *******************************************************/

// Signout a user
export const signOut = asyncHandler(async (req, res) => {
	// clear the cookie
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({ success: true, message: 'Logged out successfully' });
});

/*******************************************************
 * @GET_PROFILE
 * @route http://localhost:5000/api/v1/auth/getProfile
 * @description getProfile of the user
 * @returns {Object} - user
 *******************************************************/

// get the user profile
export const getProfile = asyncHandler(async (req, res) => {
	const { user } = req;
	if (!user) {
		throw new CustomError('User not found', 404);
	}
	res.status(200).json({ success: true, user });
});
