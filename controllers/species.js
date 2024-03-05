const { response } = require("express");
const { Specie } = require("../models");

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

module.exports = {
	obtainSpecies,
	createSpecie,
};
