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

	const userId = req.user._id;

	// Validate request data
	if (!transactionId || !product || !amount || !address || !phoneNumber) {
		throw new CustomError('Please provide all required order details', 400);
	}

	// Check if the product is available and has sufficient stock
	const existingProduct = await Product.findById(product);
	if (!existingProduct) {
		throw new CustomError('Product not found', 404);
	}
	if (existingProduct.stock < 1) {
		throw new CustomError('Product out of stock', 400);
	}

	// Create the order
	const order = await Order.create({
		transactionId,
		product,
		coupon,
		amount,
		address,
		phoneNumber,
		user: userId,
	});

	// Update product stock
	await Product.findByIdAndUpdate(product, { $inc: { stock: -1 } });
	res.status(201).json({
		success: true,
		message: 'Order placed successfully',
		order,
	});
});

// get only my orders
export const getMyOrders = asyncHandler(async (req, res) => {
	// Get the user ID from the request
	const userId = req.user._id;
	// Find orders belonging to the user
	const orders = await Order.find({ user: userId }).populate('product');
	// If no orders are found, return an error
	if (!orders || !orders.length) {
		return res.status(404).json({
			success: false,
			message: 'No orders found',
		});
	}
	// Send the response
	res.status(200).json({
		success: true,
		orders,
	});
});

// get all orders: admin
export const getAllOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate('product');
	if (!orders || !orders.length) {
		return res.status(404).json({ success: false, message: 'No orders found' });
	}
	res.status(200).json({
		success: true,
		orders,
	});
});

// update order status: admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
	const { orderId, status } = req.body;
	if (!orderId || !status) {
		throw new CustomError('Please provide order ID and status', 400);
	}
	const order = await Order.findByIdAndUpdate(
		orderId,
		{ status },
		{ new: true }
	);
	if (!order) {
		throw new CustomError('Order not found', 404);
	}
	res.status(200).json({
		success: true,
		order,
	});
});

// delete order: admin
export const deleteOrder = asyncHandler(async (req, res) => {
	const { orderId } = req.body;
	if (!orderId) {
		throw new CustomError('Please provide order ID', 400);
	}
	const order = await Order.findByIdAndDelete(orderId);
	if (!order) {
		throw new CustomError('Order not found', 404);
	}
	res.status(200).json({
		success: true,
		message: 'Order deleted successfully',
	});
});
