const mongoose = require("mongoose");

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
		default: Date.now,
	},
});

recordSchema.methods.toJSON = function () {
	//remove __v and state
	const { __v, state, ...data } = this.toObject();

	return data;
};

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
