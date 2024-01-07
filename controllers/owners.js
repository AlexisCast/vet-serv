const { response } = require("express");
const { Owner } = require("../models");

const obtainOwners = async (req, res = response) => {
	const { limit = 50, from = 0 } = req.query;
	///api/owners?limit=5&from=10

	const query = { state: true };
	// const query = { state: { $in: [true, false] } };

	const [total, owners] = await Promise.all([
		Owner.countDocuments(query),
		Owner.find(query)
			.populate("user", "name")
			.sort({ name: 1 })
			.skip(Number(from))
			.limit(Number(limit)),
	]);

	res.json({
		total,
		owners,
	});
};

const obtainOwner = async (req, res = response) => {
	const { id } = req.params;

	const owner = await Owner.findById(id).populate("user", "name");

	res.json(owner);
};

const createOwner = async (req, res = response) => {
	const { user, ...body } = req.body;

	const ownerDB = await Owner.findOne({ name: body.name.toUpperCase() });

	if (ownerDB) {
		return res.status(400).json({
			msg: `The owner ${ownerDB.name}, already exist`,
		});
	}

	//Generate the data to create/save
	const data = {
		...body,
		name: body.name.toUpperCase(),
		lastName: body.lastName.toUpperCase(),
		user: req.user._id,
	};

	const owner = await new Owner(data);

	//Create/Save in DB
	await owner.save();

	res.status(201).json(owner);
};

const updateOwner = async (req, res = response) => {
	const { id } = req.params;
	const { state, user, ...data } = req.body;

	if (data.name) {
		data.name = data.name.toUpperCase();
	}
	if (data.lastName) {
		data.name = data.name.toUpperCase();
	}

	data.user = req.user._id;

	const owner = await Owner.findByIdAndUpdate(id, data, {
		new: true,
	});

	res.json(owner);
};

//update state to falsy
const deleteOwner= async (req, res = response) => {
	const { id } = req.params;

	//Delete physically
	// const user = await Product.findByIdAndDelete(id);

	const ownerDeleted = await Owner.findByIdAndUpdate(
		id,
		{ state: false },
		{ new: true }
	);

	res.json(ownerDeleted);
};

module.exports = {
	createOwner,
	obtainOwners,
	obtainOwner,
	updateOwner,
  deleteOwner
};
