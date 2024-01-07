const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT, isAdminRole } = require("../middlewares");

const {
	existProductByID,
	existCategoryByID,
} = require("../helpers/db-validators");

const {
	createProduct,
	obtainProducts,
	obtainProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/products");

const router = Router();

//Get all the products - public
router.get("/", obtainProducts);

//Get a product by id - public
router.get(
	"/:id",
	[
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existProductByID),
		validateFields,
	],
	obtainProduct
);

//Create product - private - any with valid token
router.post(
	"/",
	[
		validateJWT,
		isAdminRole,
		check("name", "The name is required").not().isEmpty(),
		check("category", "The category is not a Mongo ID").isMongoId(),
		check("category").custom(existCategoryByID),
		check("price", "Price must be a number between 0 and 9999").isFloat({
			min: 0,
			max: 9999,
		}),
		validateFields,
	],
	createProduct
);

//Update - private- any with valid token
router.put(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("category", "The category is not a Mongo ID").isMongoId(),
		check("id").custom(existProductByID),
		validateFields,
	],
	updateProduct
);

//Delete a product - Admin
router.delete(
	"/:id",
	[
		validateJWT,
		isAdminRole,
		check("id", "Not a Mongo ID valid").isMongoId(),
		check("id").custom(existProductByID),
		validateFields,
	],
	deleteProduct
);

module.exports = router;
