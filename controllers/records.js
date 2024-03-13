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
				select: "name specie owner",
				populate: [
					{ path: "specie", model: "Specie", select: "name" },
					{ path: "owner", model: "Owner", select: "lastName name" },
				],
			})
			.select("createdAt createdAtByUser")
			.sort({ createdAt: -1 })
			.skip(Number(from))
			.limit(Number(limit)),
	]);

	// console.log(records)
	res.json({
		total,
		records: records.map((record) => ({
			patient: {
				id: record.patient._id,
				name: record.patient.name,
				specie: record.patient.specie.name,
				ownerName: record.patient.owner.name,
				ownerLastName: record.patient.owner.lastName,
			},
			createdAt: record.createdAt,
			createdAtByUser: record.createdAtByUser,
		})),
	});
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

module.exports = {
	obtainRecords,
	createRecord,
};
