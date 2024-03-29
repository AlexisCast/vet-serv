const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, isAdminRole } = require("../middlewares");

const { existOwnerByID } = require("../helpers/db-validators");

const {
	obtainOwners,
	createOwner,
	obtainOwner,
	updateOwner,
	deleteOwner,
} = require("../controllers/owners");

const { obtainPatientsByOwner } = require("../controllers/patients");

const router = Router();

//Get all the owners - private
router.get("/", [validateJWT, isAdminRole, validateFields], obtainOwners);

//Get a owner by id - private
router.get(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existOwnerByID),
		validateFields,
	],
	obtainOwner
);

router.get(
	"/:id/patients",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existOwnerByID),
		validateFields,
	],
	obtainPatientsByOwner
);

//Create owner - private - any with valid token
router.post(
	"/",
	[
		validateJWT,
		isAdminRole,
		check("name", "The name is required").not().isEmpty(),
		check("lastName", "The lastName is required").not().isEmpty(),
		check("phoneNumber1", "The phoneNumber1 is required").not().isEmpty(),
		validateFields,
	],
	createOwner
);

//Update - private - Admin
router.put(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existOwnerByID),
		check("name", "The name is required").not().isEmpty(),
		check("lastName", "The lastName is required").not().isEmpty(),
		check("phoneNumber1", "The phoneNumber1 is required").not().isEmpty(),
		validateFields,
	],
	updateOwner
);

//Delete a owner - Admin
router.delete(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existOwnerByID),
		validateFields,
	],
	deleteOwner
);

module.exports = router;
