const { response } = require("express");

const { Product } = require("../models");

//paged - total- populate
const obtainProducts = async (req, res = response) => {
	const { limit = 50, from = 0 } = req.query;
	///api/categories?limit=5&from=10

	const query = { state: true };
	// const query = { state: { $in: [true, false] } };

	const [total, products] = await Promise.all([
		Product.countDocuments(query),
		Product.find(query)
			.populate("user", "name")
			.populate("category", "name")
			.sort({ name: 1 })
			.skip(Number(from))
			.limit(Number(limit)),
	]);

	res.json({
		total,
		products,
	});
};

// populate
const obtainProduct = async (req, res = response) => {
	const { id } = req.params;

	const product = await Product.findById(id)
		.populate("user", "name")
		.populate("category", "name");

	res.json(product);
};

const createProduct = async (req, res = response) => {
	const { state, user, ...body } = req.body;

	const productDB = await Product.findOne({ name: body.name });

	if (productDB) {
		return res.status(400).json({
			msg: `The product ${productDB.name}, already exist`,
		});
	}

	//Generate the data to create/save
	const data = {
		...body,
		name: body.name.toUpperCase(),
		user: req.user._id,
	};

	const product = await new Product(data);

	//Create/Save in DB
	await product.save();

	res.status(201).json(product);
};

//update state to falsy
const updateProduct = async (req, res = response) => {
	const { id } = req.params;
	const { state, user, ...data } = req.body;

	if (data.name) {
		data.name = data.name.toUpperCase();
	}

	data.user = req.user._id;

	const product = await Product.findByIdAndUpdate(id, data, { new: true });

	res.json(product);
};

const deleteProduct = async (req, res = response) => {
	const { id } = req.params;

	//Delete physically
	// const user = await Product.findByIdAndDelete(id);

	const productDeleted = await Product.findByIdAndUpdate(
		id,
		{ state: false },
		{ new: true }
	);

	res.json({
		productDeleted,
	});
};

module.exports = {
	createProduct,
	obtainProducts,
	obtainProduct,
	updateProduct,
	deleteProduct,
};
