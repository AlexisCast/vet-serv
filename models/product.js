const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "The name is required"],
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
	price: {
		type: Number,
		default: 0,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	description: {
		type: String,
	},
	available: {
		type: Boolean,
		default: true,
	},
	img: {
		type: String,
	},
});

productSchema.methods.toJSON = function () {
	//remove __v and state
	const { __v, state, ...data } = this.toObject();

	return data;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
