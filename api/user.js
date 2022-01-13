const emailHandler = require('../extends/email');
const User = require('../models/user');

module.exports = function (app, pageLocation, pages) {
	//new user
	app.post(pageLocation + "/signup", function(req, res) {
		if(!checkEmailAndPassword(req.body.email, req.body.password)) return res.json({response : 'Error'}); //check signup mail&password like client
		
		var newUser = new User(req.body);
		newUser.save(err => {
			if(err) return res.json({response : 'Error', msg : 'User ' + req.body.email + ' already exists in the system'}); 

			var text = 'User: ' + req.body.email + '\nPassword: ' + req.body.password;
			emailHandler.sendMail(req.body.email, 'Thank you for registering', text); //send mail to user about successful registration
			return res.json({response : 'Success', msg : 'Successfully registered to user ' + req.body.email, redirect : pages.login });
		});
	});
	
	//forgotpassword
	app.post(pageLocation + "/forgotpassword", function(req, res) {
		if(req.body.email == null) return res.json({response : 'Error'});
		
		User.findOne({email: req.body.email.toLowerCase()}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			if(result == null) return res.json({response : 'Error', msg : 'User ' + req.body.email + ' doesnt in the system'});
			
			var text = 'User: ' + result._id + '\nPassword: ' + result.password;
			emailHandler.sendMail(req.body.email, 'Reset Password', text); //send mail with the password
			return res.json({response : 'Success', msg : 'Password sent to email ' + req.body.email, redirect : pages.login});
		});
	});
	
	//login
	app.post(pageLocation, function(req, res) {
		if(req.body.email == null) return res.json({response : 'Error'});
	
		User.findOne({email: req.body.email.toLowerCase()}, (err, result) => {
			if(err) return res.json({response : 'Error'});
			if((result == null) || (result.password != req.body.password)) return res.json({response : 'Error', msg : 'Incorrect username or password'});
			
			req.session.user = result;
			return res.json({response : 'Success', msg : 'Login successful', redirect : pages.maintance});
		});
	});
	
	//logout from system
	app.post(pageLocation + '/logout', function(req, res) {
		if(!req.session.user) return res.json({response : 'Error'}); //block guests
		
		req.session.user = null;
		res.json({response : 'Success', msg : 'Logout successful', redirect : '/'});
	});
};

//check mail and password
function checkEmailAndPassword(email, pass){
	if(email == null || pass == null) return false;
	if (!email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/))
		return false;
	if(pass.length < 6){
		return false;
	} else if (!pass.match(/^(?=.*[A-Z])/)){
		return false;
	} else if (!pass.match(/^(?=.*[a-z])/)){
		return false;
	} else if (!pass.match(/^(?=.*\d)/)){
		return false;
	} else if (!pass.match(/^(?=.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#])/)){
		return false;
	}
	return true;
}