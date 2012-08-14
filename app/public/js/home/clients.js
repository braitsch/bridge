
$(document).ready(function(){

	$('#clients-page form input').focus();
	$('#clients-page form #search').click(function() { return false; })
	$('#clients-page form #register').click(function() { registerClient(); return false; })
	$('#clients-page .member').click(function(e){ clientId = $(e.currentTarget).attr('id'); getClientData(); })
// add new client modal window //

	var pageNum = 1;
	var clientId = 0;
	var clientAdd = $('#add-client');
		clientAdd.modal({ show : false, keyboard : true, backdrop : true });
		clientAdd.on('shown', function() { $('#add-client input')[0].focus(); });
		clientAdd.on('hidden', function() { $('#clients-page form input').focus(); });
	var clientEdit = $('#edit-client');
		clientEdit.modal({ show : false, keyboard : true, backdrop : true });
		clientEdit.on('shown', function() { $('#edit-client input')[0].focus(); });
		clientEdit.on('hidden', function() { $('#clients-page form input').focus(); });
	
	$('#add-client #btn2').click(function(){
		if (pageNum == 1){
			pageNum = 2;
			$('#add-client #btn1').text('Back');
			$('#add-client #btn2').text('Register');
			$('#add-client .subheading').text("Step 2 of 2 • Please Enter Your Client's Personal Details");
			$('#add-client #page-1').hide('slide', { direction: 'left' }, 500);
			$('#add-client #page-2').show('slide', { direction: 'right' }, 500);
			return false;
		}
	});
	$('#add-client #btn1').click(function(){
		if (pageNum == 1){
			clientAdd.modal('hide');
		}	else{
			pageNum = 1;
			$('#add-client #btn1').text('Cancel');
			$('#add-client #btn2').text('Next');
			$('#add-client .subheading').text("Step 1 of 2 • Please Enter Your Client's Personal Details");
			$('#add-client #page-1').show('slide', { direction: 'left' }, 500);
			$('#add-client #page-2').hide('slide', { direction: 'right' }, 500);
		}
		return false;
	});
	$('#add-client form').ajaxForm({
		url : '/client-add-new',
		beforeSubmit : function(data){
			// validate //
		},
		success	: function(res, status, xhr){
			drawClients(res);
			clientAdd.modal('hide');
		},
		error : function(e){
			console.log('error adding new client record!', e)
		}
	});
	
	$('#edit-client #btn2').click(function(){
		if (pageNum == 1){
			pageNum = 2;
			$('#edit-client #btn1').text('Back');
			$('#edit-client #btn2').text('Save');
			$('#edit-client #page-1').hide('slide', { direction: 'left' }, 500);
			$('#edit-client #page-2').show('slide', { direction: 'right' }, 500);
			return false;
		}
	});
	$('#edit-client #btn1').click(function(){
		if (pageNum == 1){
			clientEdit.modal('hide');
		}	else{
			pageNum = 1;
			$('#edit-client #btn1').text('Cancel');
			$('#edit-client #btn2').text('Next');
			$('#edit-client #page-1').show('slide', { direction: 'left' }, 500);
			$('#edit-client #page-2').hide('slide', { direction: 'right' }, 500);
		}
		return false;
	});
	$('#edit-client form').ajaxForm({
		url : '/client-edit',
		beforeSubmit : function(data){
			// validate //
			data.push({name:'id', value:clientId});
		},
		success	: function(res, status, xhr){
			drawClients(res);
			clientEdit.modal('hide');
		},
		error : function(e){
			console.log('error updating client record!', e)
		}
	});
	
// show client data window //
	var getClientData = function()
	{
		$.ajax({
			url : '/client-lookup',
			type : 'POST',
			data : { id : clientId },
			success: function(o){
				showClientData(o);
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}
	var registerClient = function()
	{
		pageNum = 1;
		$('#add-client #btn1').text('Cancel');
		$('#add-client #btn2').text('Next');
		$('#add-client .subheading').text("Step 1 of 2 • Please Enter Your Client's Personal Details");
		$('#add-client #page-1').show();
		$('#add-client #page-2').hide();
		clientAdd.modal('show');
	}
	
	var showClientData = function(o)
	{
		pageNum = 1;
		$('#edit-client #btn1').text('Cancel');
		$('#edit-client #btn2').text('Next');
		$('#edit-client #page-1').show();
		$('#edit-client #page-2').hide();
		$('#edit-client #client-fname input').val(o.fname);
		$('#edit-client #client-lname input').val(o.lname);
		$('#edit-client #client-gender select').val(o.gender);
		$('#edit-client #client-ethnicity select').val(o.ethnicity);
		$('#edit-client #client-dob-month select').val(o.birthMonth);
		$('#edit-client #client-dob-day select').val(o.birthDay);
		$('#edit-client #client-dob-year select').val(o.birthYear);
		$('#edit-client #client-social input').val(o.social);
		$('#edit-client #client-lang select').val(o.language);
		$('#edit-client #client-height-ft select').val(o.heightFeet);
		$('#edit-client #client-height-in select').val(o.heightInches);
		$('#edit-client #client-eyes select').val(o.eyeColor);
		$('#edit-client #client-vet select').val(o.veteran);
		$('#edit-client #client-disabled select').val(o.disabled);
		$('#edit-client #client-tb select').val(o.tuberculous);
		clientEdit.modal('show');
	}
	var drawClients = function(a)
	{
		$('#clients').empty();
		for (var i=0; i < a.length; i++) {
			var s = "<div id='"+a[i]._id+"' class='member well'>";
			s+= "<div class='image'>";
			s+= "<img src='./img/icons/ui/user.png' /></div>";
			s+= capitalize(a[i].fname)+' '+capitalize(a[i].lname);
			s+= "<div class='edit'></div></div>";
			$('#clients').append(s);
		}
		$('#clients .member').click(function(e){ clientId = $(e.currentTarget).attr('id'); getClientData(); })
	}
	
});