const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, isAdminRole, validateFields } = require("../middlewares");

const { existPatientByID } = require("../helpers/db-validators");

const {} = require("../controllers/patients");
const { createRecord } = require("../controllers/records");

const router = Router();

//Create patient - private - with valid token
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
