const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, isAdminRole } = require("../middlewares");

const { obtainSpecies, createSpecie } = require("../controllers/species");

const router = Router();

//Get all the species - private - with valid token
router.get("/", [validateJWT, isAdminRole, validateFields], obtainSpecies);

//Create specie - private - with valid token
router.post(
	"/",
	[
		validateJWT,
		isAdminRole,
		check("name", "The specie name is required").not().isEmpty(),
		validateFields,
	],
	createSpecie
);

module.exports = router;
