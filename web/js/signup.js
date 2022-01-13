$(document).ready( function() {	

	//signup
	$("#signupForm").on("submit",function(e) {
		e.preventDefault(); // avoid to execute the actual submit of the form.
		$.ajax({
			url: "/api/user/signup",
			type: "POST",
			data: $("#signupForm").serialize(), // serializes the form's elements.
			success: function(data)
			{
				$("#Alert").load("alert/alert",function(){
					$("#AlertMsg").hide();
					alertBox(data);
				});
			}
		});
	});
	
	//email validation
	$("#inputEmail").on("input",function(e) {
		runningEPCheck('Email',checkMSGEmail);
		setCustomValidityEP(this,checkMSGEmail);
	});
	
	//password validation
	$("#inputPassword").on("input",function(e) {
		runningEPCCheck('Password',checkMSGPass);
		setCustomValidityEP(this,checkMSGPass);
	});
	
	//confirm password validation
	$("#inputPasswordC").on("input",function(e) {
		runningEPCheck('PasswordC',checkMSGPassC);
		setCustomValidityEP(this,checkMSGPassC);
	});
});