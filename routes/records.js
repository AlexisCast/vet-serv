const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, isAdminRole, validateFields } = require("../middlewares");

const { existPatientByID } = require("../helpers/db-validators");

const { createRecord, obtainRecords } = require("../controllers/records");

const router = Router();

//Get all the medical records - private - with valid token
router.get("/", [validateJWT, isAdminRole, validateFields], obtainRecords);

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

module.exports = router;
