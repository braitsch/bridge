
$(document).ready(function(){
	
	var pageNum = 1;
	
	$('#clients form input').focus();
	$('#clients form #search').click(function() { return false; })
	$('#clients form #register').click(function() { clientAdd.modal('show'); return false; })
	
	$('#add-client #btn2').click(function(){
		if (pageNum == 1){
			pageNum = 2;
			$('#add-client #btn1').text('Back');
			$('#add-client #btn2').text('Register');
			$('.subheading').text("Step 2 of 2 • Please Enter Your Client's Personal Details");
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
			$('#add-client #btn2').text('Next Step');
			$('.subheading').text("Step 1 of 2 • Please Enter Your Client's Personal Details");
			$('#add-client #page-1').show('slide', { direction: 'left' }, 500);
			$('#add-client #page-2').hide('slide', { direction: 'right' }, 500);
		}
		return false;
	});

	$('#add-client #page-2').hide();

	var clientAdd = $('#add-client');
	clientAdd.modal({ show : false, keyboard : true, backdrop : true });
	clientAdd.on('shown', function() { $('#add-client input')[0].focus(); });
	clientAdd.on('hidden', function() { $('#clients form input').focus(); });
	
	$('#add-client form').ajaxForm({
		url : '/client-add-new',
		beforeSubmit : function(data){
			// validate //
		},
		success	: function(responseText, status, xhr){
			window.location.href = '/clients';
		},
		error : function(e){
			console.log('error!', e)
		}
	});
	
});