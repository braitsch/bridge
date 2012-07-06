
$(document).ready(function(){
	
// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');
	$('.modal-confirm .submit').click(function(){
		$('.modal-confirm').modal('hide');
		$.ajax({
			url : '/delete',
			type : "POST",
			success: function(data){
				setTimeout(onDeleteSuccess, 500);
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	});
	
	$('#delete').click(function(){ $('.modal-confirm').modal('show'); })
	
// show a redirect alert on delete success //
	
	function onDeleteSuccess()
	{
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Success!');
		$('.modal-alert .modal-body p').html('Your account has been deleted.<br>Redirecting you back to the dashboard.');
		$('.modal-alert button').click(function(){window.location.href = '/';})
		$('.modal-alert').modal('show');
		setTimeout(function(){window.location.href = '/';}, 3000);
	}

});