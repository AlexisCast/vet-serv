const jwt = require("jsonwebtoken");

const generateJWT = (uid = "", time = "4h") => {
	return new Promise((resolve, reject) => {
		const payload = { uid };

		jwt.sign(
			payload,
			process.env.SECRETEORPRIVATEKEY,
			{
				expiresIn: time,
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject("Could not generate token");
				} else {
					resolve(token);
				}
			}
		);
	});
};

module.exports = { generateJWT };
