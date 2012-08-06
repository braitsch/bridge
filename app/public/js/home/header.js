
$(document).ready(function(){

	var logoutModal = $('.modal-logout');
		logoutModal.modal({ show : false, keyboard : true, backdrop : true });

	$('#btn-logout').click(function(){
		$.ajax({
			url: '/logout',
			type: "POST",
			success: function(data){
				onLogoutSuccess();
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	})
	
	function onLogoutSuccess()
	{
		logoutModal.modal('show');
		$('body, html').click(function(){window.location.href = '/';});
		setTimeout(function(){window.location.href = '/';}, 3000);
	}

})