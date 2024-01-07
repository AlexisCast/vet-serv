const Role = require("../models/role");
const User = require("../models/user");
const { Category, Product } = require("../models");

const isRoleValid = async (role = "") => {
	const existRole = await Role.findOne({ role });
	if (!existRole) {
		throw new Error(`The role ${role} is not registered in the DB`);
	}
};

const existEmail = async (email = "") => {
	const existEmail = await User.findOne({ email });
	if (existEmail) {
		throw new Error(`The email: ${email}, is already registered`);
	}
};

const existUserByID = async (id = "") => {
	const existUser = await User.findById(id);
	if (!existUser) {
		throw new Error(`The id does not exist: ${id}`);
	}
};

const existCategoryByID = async (id = "") => {
	const existCategory = await Category.findById(id);
	if (!existCategory) {
		throw new Error(`The id for category does not exist: ${id}`);
	}
};

const existProductByID = async (id = "") => {
	const existProduct = await Product.findById(id);
	if (!existProduct) {
		throw new Error(`The id for product does not exist: ${id}`);
	}
};

const collectionsPermitted = (collection = "", collections = []) => {
	const includes = collections.includes(collection);
	if (!includes) {
		throw new Error(
			`The collection: ${collection} is not permitted, ${collections}`
		);
	}

	return true;
};

module.exports = {
	isRoleValid,
	existEmail,
	existUserByID,
	existCategoryByID,
	existProductByID,
	collectionsPermitted,
};
