const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { User, Category, Product, Patient, Owner } = require("../models");

const { validateJWT, isAdminRole, validateFields } = require("../middlewares");

const allowedCollections = [
	"categories",
	"owners",
	"owners",
	"patients",
	"products-by-category",
	"products",
	"roles",
	"users",
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

const searchPatients = async (phrase = "", res = response) => {
	const isMongoID = ObjectId.isValid(phrase); //True

	console.log("phrase");
	console.log(phrase);

	if (isMongoID) {
		const patient = await Patient.findById(phrase);

		return res.json({
			results: patient ? [patient] : [],
		});
	}

	const regex = new RegExp(phrase, "i");

	const patients = await Patient.find({ name: regex, state: true })
		.populate("owner", "name lastName phoneNumber1")
		.populate("specie", "name")
		.sort({ name: 1 });

	res.json({
		results: patients,
	});
};

const searchOwners = async (phrase = "", res = response) => {
	const isMongoID = ObjectId.isValid(phrase); //True

	if (isMongoID) {
		const owner = await Owner.findById(phrase);

		return res.json({
			results: owner ? [owner] : [],
		});
	}

	const regex = new RegExp(phrase, "i");

	const owners = await Owner.find({
		$or: [{ name: regex }, { lastName: regex }, { phoneNumber1: regex }],
		state: true,
	}).sort({ name: 1 });

	res.json({
		results: owners,
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

		case "patients":
			searchPatients(phrase, res);
			break;

		case "owners":
			searchOwners(phrase, res);
			break;

		case "products":
			[validateJWT, isAdminRole, validateFields],
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
