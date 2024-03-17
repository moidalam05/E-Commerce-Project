import asyncHandler from '../service/asyncHandler';
import CustomError from '../utils/CustomError';
import Product from '../models/product.schema.js';
import Order from '../models/order.schema.js';
import Coupon from '../models/coupon.schema.js';
import razorpay from '../config/razorpay.config.js';

export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
	const { products, couponCode } = req.body;

	if (!products || products.length === 0) {
		throw new CustomError('Product not found', 404);
	}

	let totalAmount = 0;
	let discountAmount = 0;

	// do product calculation based on DB calls
	let productPriceCalc = Promise.all(
		products.map(async (product) => {
			const { productId, count } = product;
			const productFromDB = await Product.findById(productId);
			if (!productFromDB) {
				throw new CustomError('Product not found', 404);
			}
			if (productFromDB.stock < count) {
				return res.status(400).json({
					error: 'Product out of stock',
				});
			}
			totalAmount += productFromDB.price * count;
		})
	);

	await productPriceCalc;

	// check for coupon code discount, if applicabled
	if (couponCode) {
		const coupon = await Coupon.findOne({ code: couponCode });
		if (coupon) {
			discountAmount = (totalAmount * coupon.discount) / 100;
			totalAmount -= discountAmount;
		} else {
			return res.status(400).json({
				error: 'Invalid coupon code',
			});
		}
	}

	const options = {
		amount: Math.round(totalAmount * 100),
		currency: 'INR',
		receipt: `receipt_${new Date().getTime()}`,
	};

	const order = await razorpay.orders.create(options);
	if (!order) {
		throw new CustomError('Unable to create order', 500);
	}
	res.status(200).json({
		success: true,
		message: 'Razorpay order id created successfully',
		order,
	});
});

// add order in database and update product stock after successful payment
export const generateOrder = asyncHandler(async (req, res) => {
	const {
		transactionId,
		product,
		coupon,
		amount,
		address,
		phoneNumber,
	} = req.body;
});

// get only my orders
export const getMyOrders = asyncHandler(async (req, res) => {});

// get all orders: admin
export const getAllOrders = asyncHandler(async (req, res) => {});

// update order status: admin
export const updateOrderStatus = asyncHandler(async (req, res) => {});

// delete order: admin
export const deleteOrder = asyncHandler(async (req, res) => {});
