const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { uploadFile } = require("../helpers");

const { User, Product } = require("../models");

const loadFile = async (req, res = response) => {
	//Images
	try {
		// const name = await uploadFile(
		// 	req.files,
		// 	["txt", "md", "docx"],
		// 	"texts"
		// );
		const name = await uploadFile(req.files, undefined, "imgs");

		res.json({
			name,
		});
	} catch (error) {
		res.status(400).json({
			msg: error,
		});
	}
};

const updateImage = async (req, res = response) => {
	const { id, collection } = req.params;

	let model;

	switch (collection) {
		case "users":
			model = await User.findById(id);
			if (!model) {
				return res.status(400).json({
					msg: `User ${id}, does not exist.`,
				});
			}
			break;

		case "products":
			model = await Product.findById(id);
			if (!model) {
				return res.status(400).json({
					msg: `Product ${id}, does not exist.`,
				});
			}
			break;

		default:
			return res
				.status(500)
				.json({ msg: "Needs validation contact Administrator" });
	}

	//Clean previous image
	try {
		if (model.img) {
			//Must erase image from server
			const pathImage = path.join(
				__dirname,
				"../uploads",
				collection,
				model.img
			);

			if (fs.existsSync(pathImage)) {
				fs.unlinkSync(pathImage);
			}
		}
	} catch (error) {
		console.log(error);
	}
	const name = await uploadFile(req.files, undefined, collection);
	model.img = name;

	await model.save();

	res.json(model);
};

const updateImageCloudinary = async (req, res = response) => {
	const { id, collection } = req.params;

	let model;

	switch (collection) {
		case "users":
			model = await User.findById(id);
			if (!model) {
				return res.status(400).json({
					msg: `User ${id}, does not exist.`,
				});
			}
			break;

		case "products":
			model = await Product.findById(id);
			if (!model) {
				return res.status(400).json({
					msg: `Product ${id}, does not exist.`,
				});
			}
			break;

		default:
			return res
				.status(500)
				.json({ msg: "Needs validation contact Administrator" });
	}

	//Clean previous image
	try {
		if (model.img) {
			const nameArr = model.img.split("/");
			const name = nameArr[nameArr.length - 1];
			const [public_id] = name.split(".");

			await cloudinary.uploader.destroy(
				`RestServer NodeJs/${collection}/${public_id}`
			);
		}
	} catch (error) {
		console.log(error);
	}
	const { tempFilePath } = req.files.file;

	// const resp = await cloudinary.uploader.upload(tempFilePath, {
	// 	folder: `RestServer NodeJs/${collection}`,
	// });
	const resp = await cloudinary.uploader.upload(tempFilePath, {
		folder: `RestServer NodeJs/${collection}`,
		transformation: [
			{
				width: 250,
				height: 250,
				crop: "limit",
				gravity: "center",
				// effect: "art:hokusai",
			},
		],
	});

	const { secure_url } = resp;

	model.img = secure_url;

	await model.save();

	res.json(model);
};

const showImage = async (req, res = response) => {
	const { id, collection } = req.params;

	let model;

	switch (collection) {
		case "users":
			model = await User.findById(id);
			if (!model) {
				return res.status(400).json({
					msg: `User ${id}, does not exist.`,
				});
			}
			break;

		case "products":
			model = await Product.findById(id);
			if (!model) {
				return res.status(400).json({
					msg: `Product ${id}, does not exist.`,
				});
			}
			break;

		default:
			return res
				.status(500)
				.json({ msg: "Needs validation contact Administrator" });
	}

	//Clean previous image
	try {
		if (model.img) {
			//Must erase image from server
			const pathImage = path.join(
				__dirname,
				"../uploads",
				collection,
				model.img
			);

			if (fs.existsSync(pathImage)) {
				return res.sendFile(pathImage);
			}
		}
	} catch (error) {
		console.log(error);
	}

	const pathImage = path.join(__dirname, "../assets/no-image.jpg");
	res.sendFile(pathImage);
};

const showImageCloudinary = async (req, res = response) => {
	const { id, collection } = req.params;

	let model;

	switch (collection) {
		case "users":
			model = await User.findById(id);
			if (!model) {
				return res.status(400).json({
					msg: `User ${id}, does not exist.`,
				});
			}
			break;

		case "products":
			model = await Product.findById(id);
			if (!model) {
				return res.status(400).json({
					msg: `Product ${id}, does not exist.`,
				});
			}
			break;

		default:
			return res
				.status(500)
				.json({ msg: "Needs validation contact Administrator" });
	}

	try {
		if (model.img) {
			// return res.json({
			// 	img: model.img,
			// });
			return res.redirect(model.img);
		}
	} catch (error) {
		console.log(error);
	}

	const pathImage = path.join(__dirname, "../assets/no-image.jpg");
	res.sendFile(pathImage);
};

module.exports = {
	loadFile,
	updateImage,
	updateImageCloudinary,
	showImage,
	showImageCloudinary,
};
