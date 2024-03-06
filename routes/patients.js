const { Router } = require("express");
const { check } = require("express-validator");

const {
	validateFields,
	validateJWT,
	isAdminRole,
	validateGender,
} = require("../middlewares");

const {
	existOwnerByID,
	isSpecieValid,
	existPatientByID,
	existSpecieByID,
} = require("../helpers/db-validators");

const {
	obtainPatient,
	createPatient,
	obtainPatients,
	updatePatient,
	deletePatient,
} = require("../controllers/patients");

const router = Router();

//Get all the patients - private - with valid token
router.get("/", [validateJWT, isAdminRole, validateFields], obtainPatients);

//Get a patient by id - private - with valid token
router.get(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existPatientByID),
		validateFields,
	],
	obtainPatient
);

//Create patient - private - with valid token
router.post(
	"/",
	[
		validateJWT,
		isAdminRole,
		check("name", "The name is required").not().isEmpty(),
		// check("specie").custom(isSpecieValid),
		check("specie").custom(existSpecieByID),
		check("age", "Age must be a number between 0 and 100").isFloat({
			min: 0,
			max: 100,
		}),
		check("weight", "Weight must be a number between 0 and 999").isFloat({
			min: 0,
			max: 999,
		}),
		check("gender").custom(validateGender),
		validateFields,
	],
	createPatient
);

//Update - private - Admin
router.put(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existPatientByID),
		check("name", "The name is required").not().isEmpty(),
		// check("specie").custom(isSpecieValid),
		check("specie").custom(existSpecieByID),
		check("owner").custom(existOwnerByID),
		check("gender").custom(validateGender),
		validateFields,
	],
	updatePatient
);

//Delete a patient - Admin
router.delete(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existPatientByID),
		validateFields,
	],
	deletePatient
);

module.exports = router;
