$(document).ready(function() {
	
	//init datatable
	var treatmentsTable = $('#treatmentsTable')
				.DataTable({
					"lengthMenu": [[10, 25, 50], [10, 25, 50]],
					"iDisplayLength": 10,
					'columns': [
					{
						'className':      'details-control',
						'orderable':      false,
						'data':           null,
						'defaultContent': ''
					},
					{ 'data': '_id' },
					{ 'data': 'carid' },
					{ 'data': 'customername' },
					{ 'data': 'customerid' },
					{ 'data': 'status' },
					{
                        data: null,
                        defaultContent: '<a href="" class="edit">Edit</a> / <a href="" class="delete">Delete</a>'
                    }
					],
					"order": [[1, 'asc']]
					});
	loadTable(treatmentsTable);
	
	$('#TreatmentForm').on('submit',function(e) {
		e.preventDefault(); // avoid to execute the actual submit of the form.
		$.ajax({
				type:($('#ControllerType').text() == "Add Treatment") ? 'post' : 'put',
				data: $('#TreatmentForm').serialize(), // serializes the form's elements.
				url: ($('#ControllerType').text() == "Add Treatment") ? '/api/treatments/' : '/api/treatments/'  + $('#TreatmentID').val(),
				success: function(data)
				{
				   $('#Alert').load('alert/alert',function(){
						$('#AlertMsg').hide();
						alertBox(data);
				   });
				   loadTable(treatmentsTable);
				}
		});	
	});
	
	//edit treatment
	$('#treatmentsTable').on('click', 'a.edit', function (e) {
		e.preventDefault();
		if($(this).text() == "Edit"){
			if($('#ControllerType').text() != "Edit Treatment"){
				var data = treatmentsTable.row($(this).closest('tr')).data();
				updateForm(data);
				$(this).text("Cancel");
				setControllerType("Edit");
				$(this).closest('tr').addClass('selected');	
			}else{
				var openID = $('#TreatmentID').val();
				var data = {'response':'Error', 'msg':'Treatment number ' + openID + ' is still open for editing, please close it'};
				$('#Alert').load('alert/alert',function(){
					$('#AlertMsg').hide();
					alertBox(data);
				});
			}
		}else{
			$(this).text("Edit");
			setControllerType("Add");
			$(this).closest('tr').removeClass('selected');
		}
	} );
	
	//delete treatment
	$('#treatmentsTable').on('click', 'a.delete', function (e) {
		e.preventDefault();
		var data = treatmentsTable.row($(this).closest('tr')).data();
		$('#Confirmation').load('alert/confirmation', function(){
			$('#Confirmation').fadeIn('slow');
			$('#ConfirmationMSG').text("Are you sure you want to delete?");	
			$("#ConfirmationYes").on("click", function() {
				loadTable(treatmentsTable);				
				$.ajax({
					url: '/api/treatments/' + data._id,
					method: 'delete',
					success: function(data) {
						$('#Alert').load('alert/alert',function(){
							$('#AlertMsg').hide();
							alertBox(data);
						});
						loadTable(treatmentsTable);
					}
				});
			});
		});
	} );
	
	//close/open row details
	$('#treatmentsTable tbody').on('click', 'td.details-control', function () {
		var tr = $(this).closest('tr');
		var row = treatmentsTable.row(tr);

		//if open row => close
		if (row.child.isShown()) {
			row.child.hide();
			tr.removeClass('shown');
		} else { //if close row => open
			row.child(rowMoreDetails(row.data()) ).show();
			tr.addClass('shown');
		}
	} );
	
	//logout
	$('#logoutBtn').on('click',function(e) {
		e.preventDefault(); // avoid to execute the actual submit of the form.
		$.ajax({
			url: '/api/user/logout',
			type: 'post',
			success: function(data)
			{
				$('#Alert').load('alert/alert',function(){
					$('#AlertMsg').hide();
					alertBox(data);
				});
			}
		});
	});
	
	//car id validation
	$('#inputCarID').on('input',function(e) {
		setCustomValidityEP(this,checkMSGCarNumber);
	});
	
	//customer id validation
	$('#inputCustomerID').on('input',function(e) {
		setCustomValidityEP(this,checkMSGIDNumber);
	});
});

//load all treatments to datatable
function loadTable(treatmentsTable){
	$.ajax({
		url: '/api/treatments',
		method: 'get',
		success: function(data) {
			setControllerType("Add");
			treatmentsTable.clear().draw();
			treatmentsTable.rows.add(data).draw();
		}
	});
}

//change form mode (add / edit)
function setControllerType(type){
	switch(type){
		case "Edit":
			$('#ControllerType').text("Edit Treatment");
		break;
		case "Add":
			$('#ControllerType').text("Add Treatment");
			updateForm("");
		break;
	}
}

//row data to textbox valus
function updateForm(data){
	$('#TreatmentID').val(data._id);
	$('#inputCarID').val(data.carid);
	$('#inputCustomerName').val(data.customername);
	$('#inputCustomerID').val(data.customerid);
	if(data)
		$("#inputStatus option[value='"+ data.status +"']").prop("selected", true);
	else
		$("#inputStatus option[value='']").prop("selected", true);
	$('#inputDetails').val(data.details);
}

//treatment details
function rowMoreDetails(data) {
	myDate = new Date(data.date);
    return '<table cellpadding="2" cellspacing="0" border="0" style="padding-left:5%;">'+
        '<tr>'+
            '<td>Details of treatment:</td>'+
            '<td>'+data.details+'</td>'+
        '</tr>'+
		'<tr>'+
            '<td>Last modified date:</td>'+
            '<td>'+myDate.getDate() + '/' + ('0' + (myDate.getMonth()+1)).slice(-2) + '/' + myDate.getFullYear() + ' '+myDate.getHours()+ ':'+('0' + (myDate.getMinutes())).slice(-2)+ ':'+myDate.getSeconds()+'</td>'+
        '</tr>'+
    '</table>';
}