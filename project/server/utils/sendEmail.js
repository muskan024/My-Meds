const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'mymedscare@gmail.com',
				pass: 'Mymedscare#1',
			},
		});

		await transporter.sendMail({
			from: '"mymedscare@gmail.com" <no-reply@mymedscare.com>',
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};