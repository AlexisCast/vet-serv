const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, isAdminRole } = require("../middlewares");

const { existCategoryByID } = require("../helpers/db-validators");

const {
	createCategory,
	obtainCategories,
	obtainCategory,
	updateCategory,
	deleteCategory,
} = require("../controllers/categories");

const router = Router();

//Get all the categories - public
router.get("/", obtainCategories);

//Get a category by id - public
router.get(
	"/:id",
	[
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existCategoryByID),
		validateFields,
	],
	obtainCategory
);

//Create category - private - any with valid token
router.post(
	"/",
	[
		validateJWT,
		isAdminRole,
		check("name", "The name is required").not().isEmpty(),
		validateFields,
	],
	createCategory
);

//Update - private- any with valid token
router.put(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("name", "The name is required").not().isEmpty(),
		check("id").custom(existCategoryByID),
		validateFields,
	],
	updateCategory
);

//Delete a category - Admin
router.delete(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existCategoryByID),
		validateFields,
	],
	deleteCategory
);

module.exports = router;
