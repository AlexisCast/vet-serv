const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { User, Category, Product } = require("../models");

const allowedCollections = [
	"users",
	"categories",
	"products",
	"roles",
	"products-by-category",
];

const searchUsers = async (phrase = "", res = response) => {
	const isMongoID = ObjectId.isValid(phrase); //True

	// if (!isMongoID) {
	// 	return res.status(400).json({
	// 		msg: "Mongo id not valid",
	// 		results: [],
	// 	});
	// } else {
	if (isMongoID) {
		const user = await User.findById(phrase);

		return res.json({
			results: user ? [user] : [],
		});
	}

	const regex = new RegExp(phrase, "i");

	const users = await User.find({
		$or: [{ name: regex }, { email: regex }],
		$and: [{ state: true }],
	});

	res.json({
		results: users,
	});
};

const searchCategories = async (phrase = "", res = response) => {
	const isMongoID = ObjectId.isValid(phrase); //True

	if (isMongoID) {
		const category = await Category.findById(phrase);

		return res.json({
			results: category ? [category] : [],
		});
	}

	const regex = new RegExp(phrase, "i");

	const categories = await Category.find({ name: regex, state: true });

	res.json({
		results: categories,
	});
};

const searchProducts = async (phrase = "", res = response) => {
	const isMongoID = ObjectId.isValid(phrase); //True

	if (isMongoID) {
		const product = await Product.findById(phrase).populate(
			"category",
			"name"
		);

		return res.json({
			results: product ? [product] : [],
		});
	}

	const regex = new RegExp(phrase, "i");

	const products = await Product.find({ name: regex, state: true }).populate(
		"category",
		"name"
	);

	res.json({
		results: products,
	});
};

const searchProductByCategory = async (phrase = "", res = response) => {
	const isMongoID = ObjectId.isValid(phrase);

	if (isMongoID) {
		const product = await Product.find({
			category: new ObjectId(phrase),
		})
			.select("name price description available state")
			.populate("category", "name")
			.sort({ name: 1 });

		return res.json({
			results: product ? [product] : [],
		});
	}

	const regex = new RegExp(phrase, "i");

	const categories = await Category.find({ name: regex, state: true });

	if (!categories.length) {
		return res.status(400).json({
			msg: `No results for ${phrase}`,
		});
	}

	const products = await Product.find({
		$or: [
			...categories.map((category) => ({
				category: category._id,
			})),
		],

		$and: [{ state: true }],
	}).populate("category", "name");

	res.json({
		results: products,
	});
};

const search = (req, res = response) => {
	const { collection, phrase } = req.params;

	if (!allowedCollections.includes(collection)) {
		return res.status(400).json({
			msg: `The allowed collections are: ${allowedCollections}`,
		});
	}

	switch (collection) {
		case "users":
			searchUsers(phrase, res);
			break;

		case "categories":
			searchCategories(phrase, res);
			break;

		case "products":
			searchProducts(phrase, res);
			break;

		case "products-by-category":
			searchProductByCategory(phrase, res);
			break;

		case "roles":
			break;

		default:
			res.status(500).json({
				msg: `There is no search...`,
			});
			break;
	}

	// res.json({
	// 	collection,
	// 	phrase,
	// });
};

module.exports = {
	search,
};
