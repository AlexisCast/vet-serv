const mongoose = require("mongoose");
const moment = require("moment-timezone");

const recordSchema = new mongoose.Schema({
	costsData: {
		type: Array,
	},
	adminMedData: {
		type: Array,
	},
	state: {
		type: Boolean,
		default: true,
		required: true,
	},
	patient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Patient",
		required: true,
	},
	createdAt: {
		type: Date,
		default: () => moment.tz("America/Mexico_City").format(),
	},
	lastUpdatedAt: {
		type: Date,
		default: () => moment.tz("America/Mexico_City").format(),
	},
	createdAtByUser: {
		type: Date,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
});

recordSchema.methods.toJSON = function () {
	//remove __v and state
	const { __v, state, ...data } = this.toObject();

	return data;
};

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
