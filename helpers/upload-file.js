const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = (
	files,
	validExtensions = ["png", "jpg", "jpeg", "gif"],
	folder = ""
) => {
	return new Promise((resolve, reject) => {
		const { file } = files;
		const nameCut = file.name.split(".");
		const extension = nameCut[nameCut.length - 1];

		//Validate extention
		if (!validExtensions.includes(extension)) {
			return reject(
				`The extention ${extension} is not valid, must be ${validExtensions}`
			);
		}

		const nameTemp = uuidv4() + "." + extension;
		const uploadPath = path.join(
			__dirname,
			"../uploads/",
			folder,
			nameTemp
		);

		file.mv(uploadPath, (err) => {
			if (err) {
				reject(err);
			}

			resolve(nameTemp);
		});
	});
};

module.exports = {
	uploadFile,
};
