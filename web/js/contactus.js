$(document).ready( function() {	
	$("#contactusForm").on("submit",function(e) {
		e.preventDefault(); // avoid to execute the actual submit of the form.
		$.ajax({
			   type: "POST",
			   data: $("#contactusForm").serialize(), // serializes the form's elements.
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
		setCustomValidityEP(this,checkMSGEmail);
	});
});