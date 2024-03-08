const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, isAdminRole } = require("../middlewares");

const {
	obtainSpecies,
	createSpecie,
	SpecieObtainPatientsBySpecie,
	deleteSpecie,
	obtainSpecie,
	updateSpecie,
} = require("../controllers/species");
const { existSpecieByID, isSpecieValid } = require("../helpers");

const router = Router();

//Get all the species - private - with valid token
router.get("/", [validateJWT, isAdminRole, validateFields], obtainSpecies);

//Get a specie by id - private - with valid token
router.get(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existSpecieByID),
		validateFields,
	],
	obtainSpecie
);

//Get patients by specie by id - private - with valid token
router.get(
	"/:id/patients",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existSpecieByID),
		validateFields,
	],
	SpecieObtainPatientsBySpecie
);

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

//Update - private - Admin
router.put(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existSpecieByID),
		check("name", "The name is required").not().isEmpty(),
		check("name").custom(isSpecieValid),
		validateFields,
	],
	updateSpecie
);

//Delete a specie - Admin
router.delete(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existSpecieByID),
		validateFields,
	],
	deleteSpecie
);

module.exports = router;
