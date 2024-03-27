const mongoose = require("mongoose");
const moment = require("moment-timezone");

const ownerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "The name is required"],
	},
	lastName: {
		type: String,
		required: [true, "The lastName is required"],
	},
	phoneNumber1: {
		type: String,
		required: [true, "The phoneNumber1 is required"],
	},
	phoneNumber2: {
		type: String,
	},
	address: {
		type: String,
	},
	email: {
		type: String,
	},
	other: {
		type: String,
	},
	state: {
		type: Boolean,
		default: true,
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

ownerSchema.methods.toJSON = function () {
	//remove __v and state
	const { __v, state, ...data } = this.toObject();

	return data;
};

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;
