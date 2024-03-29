const { validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// console.log(errors.errors);
		const errorMessages = errors.errors
			.map((error) => error.msg)
			.join(", ");
		return res.status(400).json({ msg: errorMessages });
		// return res.status(400).json(errors);
	}

	next();
};

const validateGender = (gender = "") => {
	if (gender !== "F" && gender !== "M" && gender !== "") {
		throw new Error("Gender must be 'F' or 'M' or '");
	}
	return true;
};

module.exports = {
	validateFields,
	validateGender,
};
