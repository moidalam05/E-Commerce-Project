import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Product name is required'],
			trim: true,
			maxLength: [120, 'Product name must be less than 120 characters'],
		},
		price: {
			type: Number,
			required: [true, 'Product price is required'],
			minLength: [0, 'Price must be positive'],
		},
		description: {
			type: String,
            trim: true,
            required: [true, 'Product description is required'],
			maxLength: [500, 'Product description must be less than 500 characters'],
		},
		stock: {
            type: Number,
            minLength: [0, 'Stock must be positive'],
			default: 0,
		},
		sold: {
			type: Number,
			default: 0,
		},
		collectionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Collection',
			required: [true, 'Product collection is required'],
		},
	},
	{ timestamps: true, versionKey: false }
);

export default mongoose.model('Product', productSchema);
