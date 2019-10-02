const nodemailer = require('nodemailer')
const email = '***mail***@gmail.com';
const emailpass = '***email***password***';

//define gmail login user and password to nodemailer
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: { user: email, pass: emailpass }
});

//test mail sender
function sendMail(to, subject, text){
	var mailOptions = {
	to: to,
	subject: subject,
	text: text
	};
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response + ' to ' + mailOptions.to);
		}
	});
}

module.exports = {sendMail, email};