const { response } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validateIsSameUserIDasInToken = async (req, res = response, next) => {
	try {
		console.log("req.user validateIsSameUserID", req.user);
		console.log("req.user validateIsSameUserID", req.user._id);

		const extractedIdString = req.user._id.toString();
		console.log(extractedIdString);
		if (
			extractedIdString === req.params.id &&
			extractedIdString === req.body._id
		) {
			console.log("are equal");

			next();
		} else {
			console.log("are not equal");
			return res.status(401).json({
				msg: "Token not valid - not same user",
			});
		}
	} catch (error) {
		console.log(error);

		res.status(401).send({
			msg: "Token not valid",
		});
	}
};

module.exports = { validateIsSameUserIDasInToken };
