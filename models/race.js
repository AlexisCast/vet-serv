const { Schema, model } = require("mongoose");

const raceSchema = Schema({
	race: {
		type: String,
		required: [true, "The race is required"],
	},
});

module.exports = model("Race", raceSchema);
