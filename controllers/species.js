const { response } = require("express");
const { Specie, Patient, Owner } = require("../models");

const obtainSpecie = async (req, res = response) => {
	const { id } = req.params;

	const owner = await Specie.findById(id);

	res.json(owner);
};

const obtainSpecies = async (req, res = response) => {
	const { limit = 50, from = 0 } = req.query;
	///api/species?limit=5&from=10

	const query = { state: true };
	// const query = { state: { $in: [true, false] } };

	const [total, species] = await Promise.all([
		Specie.countDocuments(query),
		Specie.find(query)
			.populate("user", "name")
			.sort({ name: 1 })
			.skip(Number(from))
			.limit(Number(limit)),
	]);

	res.json({
		total,
		species,
	});
};

const SpecieObtainPatientsBySpecie = async (req, res = response) => {
	const { limit = 50, from = 0 } = req.query;
	///api/species?limit=5&from=10
	const { id } = req.params;

	const query = { state: true, specie: id };
	// const query = { state: { $in: [true, false] } };

	const [total, patients, specie] = await Promise.all([
		Patient.countDocuments(query),
		Patient.find(query)
			// .populate("user", "name")
			.populate("owner", "name lastName phoneNumber1")
			.populate("specie", "name")
			.sort({ name: 1 })
			.skip(Number(from))
			.limit(Number(limit)),
		Specie.findById(id),
	]);

	res.json({
		total,
		patients,
		specie,
	});
};

const createSpecie = async (req, res = response) => {
	const { user, ...body } = req.body;

	const SpecieDB = await Specie.findOne({ name: body.name.toUpperCase() });

	if (SpecieDB) {
		return res.status(400).json({
			msg: `The specie ${SpecieDB.name}, already exist`,
		});
	}

	//Generate the data to create/save
	const data = {
		...body,
		name: body.name.toUpperCase(),
		user: req.user._id,
	};

	const specie = await new Specie(data);

	//Create/Save in DB
	await specie.save();

	res.status(201).json(specie);
};

const updateSpecie = async (req, res = response) => {
	const { id } = req.params;
	const { state, user, ...data } = req.body;
	if (data.name) {
		data.name = data.name.toUpperCase();
	}

	data.user = req.user._id;

	const specie = await Specie.findByIdAndUpdate(id, data, {
		new: true,
	});

	res.json(specie);
};

//update state to falsy
const deleteSpecie = async (req, res = response) => {
	const { id } = req.params;

	//Delete physically
	// const user = await Specie.findByIdAndDelete(id);

	const specieDeleted = await Specie.findByIdAndUpdate(
		id,
		{ state: false },
		{ new: true }
	);

	res.json(specieDeleted);
};

module.exports = {
	obtainSpecie,
	obtainSpecies,
	SpecieObtainPatientsBySpecie,
	createSpecie,
	updateSpecie,
	deleteSpecie,
};
