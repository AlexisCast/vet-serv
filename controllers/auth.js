const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/user");

const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const {
	sendResetPasswordEmail,
	sendConfirmationResetPasswordEmail,
} = require("../emails/account");

const login = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		//Validate if the email exist
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).send({
				msg: "User / Password are not correct - email",
			});
		}

		//if the user is ACTIVE
		if (!user.state) {
			return res.status(400).send({
				msg: "User / Password are not correct - state:false",
			});
		}

		//Verify password
		const validPassword = bcryptjs.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(400).send({
				msg: "User / Password are not correct - password",
				errors: "User / Password are not correct - password",
			});
		}

		//Generate JWT
		const tokenExpiresIn = "30min";
		const token = await generateJWT(user.id, tokenExpiresIn);

		res.json({
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "Contact the administrator",
			errors
		});
	}
};

const googleSignIn = async (req, res = response) => {
	const { id_token } = req.body;

	try {
		const { email, name, img } = await googleVerify(id_token);

		let user = await User.findOne({ email });

		if (!user) {
			const data = {
				name,
				email,
				password: "googleUser",
				img,
				google: true,
			};

			user = new User(data);
			await user.save();
		}

		//If the user in DB
		if (!user.state) {
			return res.status(401).json({
				msg: "Contact the administrator, user blocked",
			});
		}

		//Generate JWT
		const token = await generateJWT(user.id);

		res.json({
			user,
			token,
		});
	} catch (error) {
		res.status(400).json({
			ok: false,
			msg: `Google Token could not be verified - ${error}`,
		});
	}
};

const forgotPassword = async (req, res = response) => {
	if (process.env.NODEMAILER_AUTH_USER && process.env.NODEMAILER_AUTH_PASS) {
		const email = req.body.email;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				msg: "User with this email does not exist",
			});
		}

		//if the user is ACTIVE
		if (!user.state) {
			return res.status(400).send({
				msg: "User / Password are not correct - state:false",
			});
		}

		const tokenExpiresIn = "15m";
		const token = await generateJWT(user.id, tokenExpiresIn);

		const userUpdated = await User.findByIdAndUpdate(
			user.id,
			{ resetLink: token },
			{ new: true }
		);

		//Send email to reset password
		sendResetPasswordEmail(email, user.name, token);

		return res.status(200).send({
			email: userUpdated.email,
			token,
			// userUpdated,
		});
	} else {
		return res.status(400).json({
			error: "You have not set up an account to send an email or a reset password key for jwt",
		});
	}
};

const updatePassword = async (req, res = response) => {
	const token = req.header("x-token");
	const { password } = req.body;

	const { user } = req;

	//Encrypt the passwrod
	const salt = bcryptjs.genSaltSync(10);
	user.password = bcryptjs.hashSync(password, salt);

	//Save in DB

	try {
		await user.save();

		//Send email confirmation
		sendConfirmationResetPasswordEmail(user.email, user.name);
		
		return res.status(200).send({ user });
	} catch (e) {
		return res.status(400).send(e);
	}

	return res.send({
		msg: "updatePassword",
		token,
		password,
	});
};

module.exports = { login, googleSignIn, forgotPassword, updatePassword };
