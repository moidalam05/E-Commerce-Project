import mongoose, { mongo } from 'mongoose';
import AuthRoles from '../utils/authRoles.js';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import config from '../config/index.js';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide your name'],
			maxlength: [50, 'Name should be less than 50 characters'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: [true, 'This Email has already been registered'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minLength: [8, 'Your Password must be at least 8 characters'],
			select: false,
		},
		roles: {
			type: String,
			enum: Object.values(AuthRoles),
			default: AuthRoles.ADMIN,
		},
		forgotPasswordToken: String,
		ForgotPasswordExpiry: Date,
	},
	{ timestamps: true, versionKey: false }
);

// Encrypt the password before save -- Hook

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods = {
	// compare password
	comparePassword: async function (enteredPassword) {
		return await bcrypt.compare(enteredPassword, this.password);
	},

	// Generate JWT token
	getJWTtoken: function () {
		return JWT.sign({ _id: this._id, role: this.role }, config.JWT_SECRET, {
			expiresIn: config.JWT_EXPIRY,
		});
	},

	// Generate Forgot Password Token
	generateForgotPasswordToken: function () {
		const forgotToken = crypto.randomBytes(20).toString('hex');

		// Hash token and set to resetPasswordToken field
		this.forgotPasswordToken = crypto
			.createHash('sha256')
			.update(forgotToken)
			.digest('hex');

		// time for token to expire
		this.ForgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
		return forgotToken;
	},
};

export default mongoose.model('User', userSchema);
