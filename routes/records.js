const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, isAdminRole, validateFields } = require("../middlewares");

const {
	existPatientByID,
	existRecordByID,
} = require("../helpers/db-validators");

const {
	createRecord,
	obtainRecords,
	obtainRecord,
	updateRecord,
} = require("../controllers/records");

const router = Router();

//Get all the medical records - private - with valid token
router.get("/", [validateJWT, isAdminRole, validateFields], obtainRecords);

//Get a medical record by id - private - with valid token
router.get(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existRecordByID),
		validateFields,
	],
	obtainRecord
);

//Create medical record - private - with valid token
router.post(
	"/",
	[
		validateJWT,
		isAdminRole,
		check("patient", "The patient is required").not().isEmpty(),
		check("patient").custom(existPatientByID),
		validateFields,
	],
	createRecord
);

//Update medical record- private - with valid token
router.put(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existRecordByID),
		validateFields,
	],
	updateRecord
);

module.exports = router;
