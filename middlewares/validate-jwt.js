const { response } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validateJWT = async (req, res = response, next) => {
	const token = req.header("x-token");
	if (!token) {
		return res.status(401).json({
			msg: "There is no token on the request",
		});
	}

	try {
		const { uid } = jwt.verify(token, process.env.SECRETEORPRIVATEKEY);

		//read user that corresponds to uid
		const user = await User.findById(uid);
		if (!user) {
			return res.status(401).json({
				msg: "Token not valid - user does not exist",
			});
		}

		//verify if the uid has the state true
		if (!user.state) {
			return res.status(401).json({
				msg: "Token not valid - user with falsy state",
			});
		}

		req.user = user;

		next();
	} catch (error) {
		console.log(error);

		if (error.name === "TokenExpiredError") {
			return res.status(403).send({
				msg: "Token has expired",
			});
		}

		res.status(401).send({
			msg: "Token not valid",
		});
	}
};

module.exports = { validateJWT };
