import Collection from '../models/collection.schema.js';
import asyncHandler from '../service/asyncHandler.js';
import CustomError from '../utils/CustomError.js';

// create a collection
export const createCollection = asyncHandler(async (req, res) => {
	const { name } = req.body;
	if (!name) {
		throw new CustomError('Please provide a collection name', 400);
	}
	const collection = await Collection.create({ name });
	res.status(201).json({
		success: true,
		message: 'Collection created successfully',
		collection,
	});
});

// get a collection
export const getCollection = asyncHandler(async (req, res) => {
	const { id: collectionId } = req.params;
	const collection = await Collection.findById(collectionId);
	if (!collection) {
		throw new CustomError('Collection not found', 404);
	}
	res.status(200).json({
		success: true,
		collection,
	});
});

// get all collections
export const getCollections = asyncHandler(async (req, res) => {
	const collections = await Collection.find();
	if (!collections) {
		throw new CustomError('No collections found', 404);
	}
	res.status(200).json({
		success: true,
		collections,
	});
});

// update a collection
export const updateCollection = asyncHandler(async (req, res) => {
	const { name } = req.body;
	const { id: collectionId } = req.params;
	if (!name) {
		throw new CustomError('Please provide a collection name', 400);
	}
	const updatedCollection = await Collection.findByIdAndUpdate(
		collectionId,
		{
			name,
		},
		{
			new: true,
			runValidators: true,
		}
	);
	if (!updatedCollection) {
		throw new CustomError('Collection not found', 404);
	}
	res.status(200).json({
		success: true,
		message: 'Collection updated successfully',
		updatedCollection,
	});
});

// delete a collection
export const deleteCollection = asyncHandler(async (req, res) => {
	const { id: collectionId } = req.params;
	const deletedCollection = await Collection.findByIdAndDelete(collectionId);
	if (!deletedCollection) {
		throw new CustomError('Collection not found', 404);
	}
	res.status(200).json({
		success: true,
		message: 'Collection deleted successfully',
	});
});
