const { response } = require("express");
const { Patient, Owner } = require("../models");

const obtainPatients = async (req, res = response) => {
	const { limit = 50, from = 0 } = req.query;
	///api/patients?limit=5&from=10

	const query = { state: true };
	// const query = { state: { $in: [true, false] } };

	const [total, patients] = await Promise.all([
		Patient.countDocuments(query),
		Patient.find(query)
			.populate("user", "name")
			.populate("owner", "name lastName phoneNumber1")
			.populate("specie", "name")
			.sort({ name: 1 })
			.skip(Number(from))
			.limit(Number(limit)),
	]);

	res.json({
		total,
		patients,
	});
};

const obtainPatientsByOwner = async (req, res = response) => {
	const { limit = 50, from = 0 } = req.query;
	///api/patients?limit=5&from=10
	const { id } = req.params;

	const query = { state: true, owner: id };
	// const query = { state: { $in: [true, false] } };

	const [total, patients, owner] = await Promise.all([
		Patient.countDocuments(query),
		Patient.find(query)
			.populate("user", "name")
			.populate("owner", "name lastName phoneNumber1")
			.populate("specie", "name")
			.sort({ name: 1 })
			.skip(Number(from))
			.limit(Number(limit)),
		Owner.findById(id).populate("user", "name"),
	]);

	res.json({
		owner,
		total,
		patients,
	});
};

const obtainPatient = async (req, res = response) => {
	const { id } = req.params;

	const patient = await Patient.findById(id)
		.populate("user", "name")
		.populate("owner", "name lastName phoneNumber1")
		.populate("specie", "name");
	res.json(patient);
};

const createPatient = async (req, res = response) => {
	const { user, ...body } = req.body;

	const patientDB = await Patient.findOne({ name: body.name.toUpperCase() });

	if (patientDB) {
		return res.status(400).json({
			msg: `The patient ${patientDB.name}, already exist`,
		});
	}

	//Generate the data to create/save
	const data = {
		...body,
		name: body.name.toUpperCase(),
		user: req.user._id,
	};

	if (data.sterilized === "") {
		delete data.sterilized; // Remove sterilized property
	}

	const patient = await new Patient(data);

	//Create/Save in DB
	await patient.save();

	res.status(201).json(patient);
};

const updatePatient = async (req, res = response) => {
	const { id } = req.params;
	const { state, user, ...data } = req.body;

	if (data.name) {
		data.name = data.name.toUpperCase();
	}

	data.user = req.user._id;

	if (data.sterilized === "") {
		delete data.sterilized; // Remove sterilized property
	}

	const patient = await Patient.findByIdAndUpdate(id, data, {
		new: true,
	});

	res.json(patient);
};

//update state to falsy
const deletePatient = async (req, res = response) => {
	const { id } = req.params;

	//Delete physically
	// const user = await Product.findByIdAndDelete(id);

	const patientDeleted = await Patient.findByIdAndUpdate(
		id,
		{ state: false },
		{ new: true }
	);

	res.json(patientDeleted);
};

module.exports = {
	createPatient,
	obtainPatients,
	obtainPatientsByOwner,
	obtainPatient,
	updatePatient,
	deletePatient,
};
