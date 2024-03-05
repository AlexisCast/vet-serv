const { Schema, model } = require("mongoose");

const specieSchema = Schema({
	name: {
		type: String,
		required: [true, "The specie is required"],
	},
	state: {
		type: Boolean,
		default: true,
		required: true,
	},
	user: {
		type: Schema.ObjectId,
		ref: "User",
		required: true,
	},
});

specieSchema.methods.toJSON = function () {
	//remove __v and state
	const { __v, state, ...data } = this.toObject();

	return data;
};

const Specie = model("Specie", specieSchema);

module.exports = Specie;
