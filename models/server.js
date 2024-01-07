const express = require("express");
var cors = require("cors");
const fileUpload = require("express-fileupload");

const { dbConnection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT || 3000;

		this.paths = {
			auth: "/api/auth",
			categories: "/api/categories",
			products: "/api/products",
			search: "/api/search",
			users: "/api/users",
			uploads: "/api/uploads",
		};

		//Connect to data base
		this.connectDB();

		//Middlewares
		this.middlewares();

		//Application routes
		this.routes();
	}

	async connectDB() {
		await dbConnection();
	}

	middlewares() {
		//CORS
		this.app.use(cors());

		//Read & parse from body
		this.app.use(express.json());

		//Public Directory
		this.app.use(express.static("public"));

		//FileUpload - upload files
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: "/tmp/",
				createParentPath: true,
			})
		);
	}

	routes() {
		this.app.use(this.paths.auth, require("../routes/auth"));
		this.app.use(this.paths.categories, require("../routes/categories"));
		this.app.use(this.paths.products, require("../routes/products"));
		this.app.use(this.paths.search, require("../routes/search"));
		this.app.use(this.paths.users, require("../routes/users"));
		this.app.use(this.paths.uploads, require("../routes/uploads"));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("Server running on port", this.port);
		});
	}
}

module.exports = Server;
