import asyncHandler from '../service/asyncHandler';
import CustomError from '../utils/CustomError';
import Coupon from '../models/coupon.model';

/*******************************************************
 * @CREATE_COUPON
 * @route http://localhost:5000/api/v1/coupon
 * @description Controller used for creating coupons
 * @description Only admin can create a coupon
 * @returns {Object} - returns the created coupon
 *******************************************************/

export const createCoupon = asyncHandler(async (req, res) => {
	const { code, discount } = req.body;
	if (!code || !discount) {
		throw new CustomError('Please provide code and discount', 400);
	}

	// if coupon already exists
	const existingCoupon = await Coupon.findOne({ code });
	if (existingCoupon) throw new CustomError('Coupon already exists', 400);

	// create coupon
	const coupon = await Coupon.create({ code, discount });
	res.status(201).json({
		success: true,
		message: 'Coupon created successfully',
		coupon,
	});
});

/*******************************************************
 * @GETALLCOUPON
 * @route http://localhost:5000/api/v1/coupon
 * @description Controller used for getting all coupons
 * @description Only admin can create a coupon
 * @returns {Object} - returns the all coupon
 *******************************************************/

export const getAllCoupon = asyncHandler(async (req, res) => {
	const allCoupons = await Coupon.find({});
	if (!allCoupons) {
		throw new CustomError('No coupons found', 400);
	}

	res.status(201).json({
		success: true,
		message: 'All coupons found successfully',
		allCoupons,
	});
});

/*******************************************************
 * @UPDATECOUPON
 * @route http://localhost:5000/api/v1/coupon
 * @description Controller used for updating coupons
 * @description Only admin can create a coupon
 * @returns {Object} - returns the updated coupon
 *******************************************************/

export const updateCoupon = asyncHandler(async (req, res) => {
	const { id: couponId } = req.params;
	const { action } = req.body;

	const coupon = await Coupon.findByIdAndUpdate(
		couponId,
		{
			active: action,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	if (!coupon) {
		throw new CustomError('Coupon not found', 400);
	}
	res.status(200).json({
		success: true,
		message: 'Coupon updated',
		coupon,
	});
});

/*******************************************************
 * @DELETECOUPON
 * @route http://localhost:5000/api/v1/coupon
 * @description Controller used for deleting coupons
 * @description Only admin can create a coupon
 * @returns {Object} - coupon
 *******************************************************/

export const deleteCoupon = asyncHandler(async (req, res) => {
	const { id: couponId } = req.params;
	let coupon = await Coupon.findByIdAndDelete(couponId);
	if (!coupon) {
		throw new CustomError('Coupon not found', 400);
	}

	res.status(200).json({
		success: true,
		message: 'Coupon has been deleted successfully',
	});
});
