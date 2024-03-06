const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "The name is required"],
	},
	age: {
		type: Number,
		min: 0,
	},
	weight: {
		type: Number,
		min: 0,
	},
	specie: {
		type: mongoose.Schema.ObjectId,
		ref: "Specie",
		required: true,
	},
	gender: {
		type: String,
		default: "",
		enum: ["F", "M", ""],
	},
	sterilized: {
		type: Boolean,
		default: false,
	},
	note: {
		type: String,
	},
	state: {
		type: Boolean,
		default: true,
		required: true,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Owner",
		required: true,
	},
	img: {
		type: String,
	},
});

patientSchema.methods.toJSON = function () {
	//remove __v and state
	const { __v, state, ...data } = this.toObject();

	return data;
};

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
