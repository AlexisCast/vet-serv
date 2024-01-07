const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const { sendWelcomeEmail } = require("../emails/account");

const usersGet = async (req, res = response) => {
	const { limit = 5, from = 0 } = req.query;
	///api/users?limit=5&from=10
	const query = { state: true };

	/* 	USE PROMISE.ALL TO SAVE TIME AND EXECUTE SIMULTANEOUSLY
  const users = await User.find(query)
		.skip(Number(from))
		.limit(Number(limit));

	const total = await User.countDocuments(query); */

	const [total, users] = await Promise.all([
		User.countDocuments(query),
		User.find(query).skip(Number(from)).limit(Number(limit)),
	]);

	res.json({
		total,
		users,
	});
};

const userPost = async (req, res = response) => {
	const { name, email, password } = req.body;
	const user = new User({ name, email, password });

	//Encrypt the password
	const salt = bcryptjs.genSaltSync(10);
	user.password = bcryptjs.hashSync(password, salt);

	//Save in DB

	try {
		await user.save();

		//Send welcome email
		sendWelcomeEmail(user.email, user.name);

		res.status(201).send({ user });
	} catch (e) {
		res.status(400).send(e);
	}
};

const usersPut = async (req, res = response) => {
	const { id } = req.params;
	const { _id, password, google, email, role, ...rest } = req.body;

	console.log("req.user", req.user);
	//TODO validate with DB
	if (password) {
		//Encrypt the password
		const salt = bcryptjs.genSaltSync(10);
		rest.password = bcryptjs.hashSync(password, salt);
	}

	const userUpdated = await User.findByIdAndUpdate(id, rest, { new: true });
	// res.status(200).send({
	// 	userUpdated,
	// });
	res.json({
		userUpdated,
	});
};

const usersDelete = async (req, res = response) => {
	const { id } = req.params;

	//Delete physically
	// const user = await User.findByIdAndDelete(id);

	//
	//	const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });

	const user = await User.findByIdAndUpdate(id, { state: false });
	const userAuthenticated = req.user;

	res.json({
		user,
		userAuthenticated,
	});
};

module.exports = {
	usersGet,
	userPost,
	usersPut,
	usersDelete,
};
