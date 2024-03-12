import Product from '../models/product.schema.js';
import formidable from 'formidable';
import { s3FileUpload, s3FileDelete } from '../utils/s3.js';
import mongoose from 'mongoose';
import asyncHandler from '../service/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import config from '../config/index.js';

/*******************************************************
 * @ADD_PRODUCT
 * @route http://localhost:5000/api/v1/product
 * @description Controller used creating a new product
 * @description Only admin can create a coupon
 * @description Uses AWS S3 Bucket for image upload
 * @returns {Object} - Product
 *******************************************************/

export const addProduct = asyncHandler(async (req, res) => {
	const form = formidable({ multiples: true, keepExtensions: true });

	form.parse(req, async (err, fields, files) => {
		if (err) {
			throw new CustomError(err.message || 'Something went wrong !', 500);
		}

		let productId = new mongoose.Types.ObjectId().toHexString();
		console.log(fields, files);
		// TODO: we will take this tommorrow
	});
});
