$(document).ready( function() {
	
	//forgotpassword
	$('#EmailForgotOpen').on('click', function() {
		$('#EmailForgot').load('alert/forgotpassword', function(){
			$('#EmailForgot').fadeIn('slow');
		});
	});
	
	//login
	$('#loginForm').on('submit',function(e) {
		e.preventDefault(); // avoid to execute the actual submit of the form.
		$.ajax({
			url: '/api/user',
			type: 'post',
			data: $('#loginForm').serialize(), // serializes the form's elements.
			success: function(data)
			{
				$('#Alert').load('alert/alert',function(){
					$('#AlertMsg').hide();
					alertBox(data);
				});
			}
		});
	});

	//show password
	$('#showPassword').on('click',function(e) {
		if(document.getElementById('inputPassword').type=='text'){
			document.getElementById('inputPassword').type='password';
			document.getElementById('showPasswordIcon').className='glyphicon glyphicon-eye-open';
		}else{
			document.getElementById('inputPassword').type='text';
			document.getElementById('showPasswordIcon').className='glyphicon glyphicon-eye-close';
		}
	});
	
	//email validation
	$('#inputEmail').on('input',function(e) {
		runningEPCheck('Email',checkMSGEmail);
		setCustomValidityEP(this,checkMSGEmail);
	});
	
	//password validation
	$('#inputPassword').on('input',function(e) {
		runningEPCheck('Password',checkMSGPass);
		setCustomValidityEP(this,checkMSGPass);
	});
});