//textbox colors change
function runningEPCheck(inputEP, checkFunc){
	if(checkFunc(document.getElementById('input' + inputEP).value)){
		document.getElementById(inputEP + 'Group').className='form-group has-error';
	}else{
		document.getElementById(inputEP + 'Group').className='form-group has-success';
	}	
}

//signup textbox color
function runningEPCCheck(inputEP, checkFunc){
	runningEPCheck(inputEP,checkFunc);
	if(document.getElementById(inputEP + 'Group').className=='form-group has-success'){
		runningEPCheck('PasswordC', checkMSGPassC);
	}
}

//email validation
//return message
function checkMSGEmail(email){
	if (!email.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
		return 'Wrong email address';
	}
	return '';
}

//password validation
//return message
function checkMSGPass(pass){
	if(pass.length < 6){
		return 'Minimum 6 Characters';
	} else if (!pass.match(/^(?=.*[A-Z])/)){
		return 'Must Include an Uppercase Character';
	} else if (!pass.match(/^(?=.*[a-z])/)){
		return 'Must Include an Lowercase Character';
	} else if (!pass.match(/^(?=.*\d)/)){
		return 'Must Include a Number';
	} else if (!pass.match(/^(?=.*[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#])/)){
		return 'Must Include a Special Character (!, @, #, etc.)';
	}
	return '';
}

//car number validation
//return message
function checkMSGCarNumber(car){
	if(!car.match(/^\d*$/)) {
		return "Car number must be number";
	} else if((Number(car).toString().length < 5) || (Number(car).toString().length > 10)) {
		return 'Car number must be between number with 5-10 digits';
	}
	return '';
}

//ID validation
//return message
function checkMSGIDNumber(id){
	if(!IsValidIsrGovId(id)) {
		return "ID number must be an Israeli ID number";
	}
	return '';
}

//code from https://github.com/atlanteh/israeli-id-validator
function IsValidIsrGovId(id) { 
    let strId = String(id).trim();
    if (strId.length > 9) {
        return false;
    }
    if (strId.length < 9) {
        while (strId.length < 9) strId = "0" + strId;
    }
    let counter = 0, rawVal, actualVal;
    for (let i = 0; i < strId.length; i++) {
        rawVal = Number(strId[i]) * ((i % 2) + 1);
        actualVal = rawVal > 9 ? (rawVal - 9) : rawVal;
        counter += actualVal;
    }
    return (counter % 10 === 0);
}

//password validation
//return message
function checkMSGPassC(passc){
	if(passc != document.getElementById('inputPassword').value)
		return 'Must be the same as the password';
	return '';
}

//popup validation
function setCustomValidityEP(passcode_input, checkFunc){
	passcode_input.setCustomValidity(checkFunc(passcode_input.value));
	passcode_input.reportValidity();
}

//top alert message
function alertBox(data){
	$('#AltRes').text(data.response);
	$('#AltMSG').text(data.msg);
	switch(data.response){
		case 'Success':  
			$('#AlertMsg').removeClass();
			$('#AlertMsg').addClass('alert success')
		break;
		case 'Error':
			$('#AlertMsg').removeClass();
			$('#AlertMsg').addClass('alert')
		break;
	}
	$('#AlertMsg').show();
	setTimeout(function() {
	$('#AlertMsg').fadeOut('slow');
	}, 1000);
	if(data.redirect){
		setTimeout(function() {
		window.location.href = data.redirect;
		}, 1000);
	}
}