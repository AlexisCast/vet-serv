const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");

const {
	login,
	googleSignIn,
	forgotPassword,
	updatePassword,
} = require("../controllers/auth");

const { validateJWT } = require("../middlewares");

const router = Router();

router.post(
	"/login",
	[
		check("email", "The email is required").isEmail(),
		check("password", "The password is required").not().isEmpty(),
		validateFields,
	],
	login
);

router.post(
	"/google",
	[check("id_token", "id_token is required").not().isEmpty(), validateFields],
	googleSignIn
);

router.put(
	"/forgot-password",
	[check("email", "The email is required").isEmail(), validateFields],
	forgotPassword
);

router.put("/reset-password", [validateJWT, validateFields], updatePassword);

module.exports = router;
