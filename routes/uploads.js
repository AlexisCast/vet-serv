const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/validate-fields");

const {
	loadFile,
	updateImage,
	updateImageCloudinary,
	showImage,
	showImageCloudinary,
} = require("../controllers/uploads");
const { collectionsPermitted } = require("../helpers");
const { validateFileToUpload, validateJWT } = require("../middlewares");

const router = Router();

router.post("/", validateFileToUpload, loadFile);

router.put(
	"/:collection/:id",
	[
		validateJWT,
		validateFileToUpload,
		check("id", "The id mush be from Mongo").isMongoId(),
		check("collection").custom((c) =>
			collectionsPermitted(c, ["users", "products"])
		),
		validateFields,
	],
	// updateImage
	updateImageCloudinary
);

router.get(
	"/:collection/:id",
	[
		check("id", "The id mush be from Mongo").isMongoId(),
		check("collection").custom((c) =>
			collectionsPermitted(c, ["users", "products"])
		),
		validateFields,
	],
	// showImage
	showImageCloudinary
);

module.exports = router;
