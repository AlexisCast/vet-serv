const moment = require("moment-timezone");

const { response } = require("express");
const { Record } = require("../models");

const obtainRecords = async (req, res = response) => {
	// TODO:updated limit
	const { limit = 15, from = 0 } = req.query;
	///api/records?limit=5&from=10

	const query = { state: true };
	// const query = { state: { $in: [true, false] } };

	const [total, records] = await Promise.all([
		Record.countDocuments(query),
		Record.find(query)
			.populate({
				path: "patient",
				select: "name specie owner user",
				populate: [
					{ path: "specie", model: "Specie", select: "name" },
					{ path: "owner", model: "Owner", select: "lastName name" },
					{ path: "user", model: "User", select: "name" },
				],
			})
			.select("createdAt createdAtByUser")
			.select("lastUpdatedAt")
			.sort({ createdAt: -1 })
			.skip(Number(from))
			.limit(Number(limit)),
	]);

	res.json({
		total,
		records: records.map((record) => ({
			_id: record._id,
			patient: {
				id: record.patient._id,
				name: record.patient.name,
				specie: record.patient.specie.name,
				ownerName: record.patient.owner.name,
				ownerLastName: record.patient.owner.lastName,
			},
			user: {
				_id: record.patient.user._id,
				name: record.patient.user.name,
			},
			lastUpdatedAt: record.lastUpdatedAt,
			createdAt: record.createdAt,
			createdAtByUser: record.createdAtByUser,
		})),
	});
};

const obtainRecord = async (req, res = response) => {
	const { id } = req.params;

	const record = await Record.findById(id).populate({
		path: "patient",
		select: "",
		populate: [
			{ path: "specie", model: "Specie", select: "name" },
			{
				path: "owner",
				model: "Owner",
				select: "lastName name phoneNumber1",
			},
			{ path: "user", model: "User", select: "name" },
		],
	});
	res.json(record);
};

const createRecord = async (req, res = response) => {
	const { user, ...body } = req.body;

	//Generate the data to create/save
	const data = {
		...body,
		user: req.user._id,
	};
	const record = await new Record(data);

	//Create/Save in DB
	await record.save();

	res.status(201).json(record);
};

const updateRecord = async (req, res = response) => {
	const { id } = req.params;
	const { state, user, ...data } = req.body;

	data.user = req.user._id;
	data.lastUpdatedAt = moment().tz("America/Mexico_City").format();

	const record = await Record.findByIdAndUpdate(id, data, {
		new: true,
	});

	res.json(record);
};

//update state to falsy
const deleteRecord = async (req, res = response) => {
	const { id } = req.params;

	//Delete physically
	// const recordDeleted = await Record.findByIdAndDelete(id);

	const recordDeleted = await Record.findByIdAndUpdate(
		id,
		{ state: false },
		{ new: true }
	);

	res.json(recordDeleted);
};

module.exports = {
	obtainRecord,
	obtainRecords,
	createRecord,
	updateRecord,
	deleteRecord,
};
