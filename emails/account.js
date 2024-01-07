const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.NODEMAILER_AUTH_USER,
		pass: process.env.NODEMAILER_AUTH_PASS,
	},
	// debug: true, // show debug output
	// logger: true, // log information in console
});

const sendWelcomeEmail = (email, name) => {
	// console.log("Sending welcome email...");

	const welcomeMailOption = {
		from: process.env.NODEMAILER_FROM,
		to: email,
		subject: "Thanks for joining in!",
		// text:  `Welcome to the app, ${name}. Let me know how you get along with the app.`,
		html: `<h1>Welcome!</h1><p>Welcome to the app, ${name}.</p><p>Let me know how you get along with the app.</p>`,
	};

	transporter.sendMail(welcomeMailOption, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(info.response);
			console.log("Message sent: %s", info.messageId);
		}
	});
};

const sendCancelationEmail = (email, name) => {
	// console.log("Sending cancelation email...");

	const cancelationMailOption = {
		from: process.env.NODEMAILER_FROM,
		to: email,
		subject: "Sorry to see you go!",
		// text:  `Goodbye, ${name}. I hope to see you back sometime soon.`,
		html: `<h1>Goodbye</h1><p>Goodbye, ${name}.</p><p>I hope to see you back sometime soon.</p>`,
	};

	transporter.sendMail(cancelationMailOption, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(info.response);
			console.log("Message sent: %s", info.messageId);
		}
	});
};

const sendResetPasswordEmail = (email, name, token) => {
	// console.log("Sending reset password email...");

	const resetPasswordMailOption = {
		from: process.env.NODEMAILER_FROM,
		to: email,
		subject: "Reset Account Password Link",
		// text:  `Goodbye, ${name}. I hope to see you back sometime soon.`,
		html: `<h1>${name} please click the link below to reset your password</h1><p>${process.env.CLIENT_URL}/resetpassword/${token}</p>`,
	};

	transporter.sendMail(resetPasswordMailOption, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(info.response);
			console.log("Message sent: %s", info.messageId);
		}
	});
};

const sendConfirmationResetPasswordEmail = (email, name) => {
	// console.log("Sending reset password email...");

	const confirmationResetPasswordMailOption = {
		from: process.env.NODEMAILER_FROM,
		to: email,
		subject: "Succesfull Password Updated",
		// text:  `Goodbye, ${name}. I hope to see you back sometime soon.`,
		html: `<h1>${name} your password has been updated</h1>`,
	};

	transporter.sendMail(
		confirmationResetPasswordMailOption,
		function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log(info.response);
				console.log("Message sent: %s", info.messageId);
			}
		}
	);
};

module.exports = {
	sendWelcomeEmail,
	sendCancelationEmail,
	sendResetPasswordEmail,
	sendConfirmationResetPasswordEmail,
};
