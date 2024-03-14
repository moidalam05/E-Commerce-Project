import Product from '../models/product.schema.js';
import formidable from 'formidable';
import { s3FileUpload, s3FileDelete } from '../utils/s3.js';
import mongoose from 'mongoose';
import asyncHandler from '../service/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import config from '../config/index.js';
import fs from 'fs';

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

		if (
			!fields.name ||
			fields.description ||
			!fields.price ||
			!fields.collectionId
		) {
			throw new CustomError('All fields are required', 400);
		}

		let imgArrayResp = Promise.all(
			Object.keys(files).map(async (file, index) => {
				const element = file[fileKey];
				console.log(element);
				const data = fs.readFileSync(element.filepath);

				const upload = await s3FileUpload({
					bucketName: config.S3_BUCKET_NAME,
					key: `product/${productId}/photo_${index + 1}.png`,
					body: data,
					contentType: element.mimetype,
				});
				// productId = 123ajahdj456
				// 1: product/123ajahdj456/photo_1.png
				// 1: product/123ajahdj456/photo_2.png
				console.log(upload);
				return {
					secure_url: upload.Location,
				};
			})
		);

		let imgArray = await imgArrayResp;
		const product = await Product.create({
			_id: productId,
			photos: imgArray,
			...fields,
		});

		if (!product) {
			throw new CustomError('Product not created', 400);
		}
		res.status(201).json({
			success: true,
			product,
		});
	});
});
