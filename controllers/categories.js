const { response } = require("express");

const { Category } = require("../models");

//paged - total- populate
const obtainCategories = async (req, res = response) => {
	const { limit = 15, from = 0 } = req.query;
	///api/categories?limit=5&from=10
	const query = { state: true };

	const [total, categories] = await Promise.all([
		Category.countDocuments(query),
		Category.find(query)
			.populate("user", "name")
			.skip(Number(from))
			.limit(Number(limit)),
	]);

	res.json({
		total,
		categories,
	});
};

// populate
const obtainCategory = async (req, res = response) => {
	const { id } = req.params;

	const category = await Category.findById(id).populate("user", "name");

	res.json(category);
};

const createCategory = async (req, res = response) => {
	const name = req.body.name.toUpperCase();

	const categoryDB = await Category.findOne({ name });

	if (categoryDB) {
		return res.status(400).json({
			msg: `The category ${categoryDB.name}, already exist`,
		});
	}

	//Generate the data to create/save
	const data = {
		name,
		user: req.user._id,
	};

	const category = await new Category(data);

	//Create/Save in DB
	await category.save();

	res.status(201).json({ category });
};

//update state to falsy
const updateCategory = async (req, res = response) => {
	const { id } = req.params;
	const { state, user, ...data } = req.body;

	data.name = data.name.toUpperCase();
	data.user = req.user._id;

	const category = await Category.findByIdAndUpdate(id, data, { new: true });

	res.json(category);
};

const deleteCategory = async (req, res = response) => {
	const { id } = req.params;

	//Delete physically
	// const user = await Category.findByIdAndDelete(id);

	const categoryDeleted = await Category.findByIdAndUpdate(
		id,
		{ state: false },
		{ new: true }
	);

	res.json({
		categoryDeleted,
	});
};

module.exports = {
	createCategory,
	obtainCategories,
	obtainCategory,
	updateCategory,
	deleteCategory,
};
