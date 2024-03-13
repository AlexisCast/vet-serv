const { response } = require("express");
const { Record } = require("../models");

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
	createRecord,
};
