const { Router } = require("express");
const { check } = require("express-validator");

const {
	validateFields,
	validateJWT,
	validateIsSameUserIDasInToken,
	isAdminRole,
	hasRole,
} = require("../middlewares");

const {
	isRoleValid,
	existEmail,
	existUserByID,
} = require("../helpers/db-validators");

const {
	usersGet,
	usersPut,
	userPost,
	usersDelete,
} = require("../controllers/users");

const router = Router();

router.get("/", [validateJWT, isAdminRole, validateFields], usersGet);

router.put(
	"/:id",
	[
		validateJWT,
		validateIsSameUserIDasInToken,
		check("id", "It is not a valid ID").isMongoId(),
		check("id").custom(existUserByID),
		check("role").custom(isRoleValid),
		validateFields,
	],
	usersPut
);

router.post(
	"/",
	[
		check("name", "The name is required").not().isEmpty(),
		check(
			"password",
			"The password must be more than 6 characters"
		).isLength({ min: 6 }),
		check("email", "The mail is not valid").isEmail(),
		check("email").custom(existEmail),
		validateFields,
	],
	userPost
);

router.delete(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		hasRole("ADMIN_ROLE", "SALES_ROLE"),
		check("id", "It is not a valid ID").isMongoId(),
		check("id").custom(existUserByID),
		validateFields,
	],
	usersDelete
);

module.exports = router;
