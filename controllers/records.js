const { response } = require("express");
const { Record } = require("../models");

const obtainRecords = async (req, res = response) => {
	// TODO:updated limit
	const { limit = 5, from = 0 } = req.query;
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

	console.log("body");
	console.log(body);
	// const categoryDB = await Category.findOne({ name });

	// if (categoryDB) {
	// 	return res.status(400).json({
	// 		msg: `The category ${categoryDB.name}, already exist`,
	// 	});
	// }

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

module.exports = {
	obtainRecord,
	obtainRecords,
	createRecord,
};
