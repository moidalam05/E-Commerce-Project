import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
	{
		product: {
			type: [
				{
					productId: {
						type: mongoose.Schema.Types.ObjectId,
						ref: 'Product',
					},
					count: Number,
					price: Number,
				},
			],
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: Number,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		coupon: String,
		transactionId: String,
		status: {
			type: String,
			enum: [
				'ORDERED',
				'PENDING',
				'PROCESSING',
				'SHIPPED',
				'DELIVERED',
				'CANCELLED',
			],
			default: 'ORDERED',
		},
	},
	{ timestamps: true, versionKey: false }
);

export default mongoose.model('Order', orderSchema);
