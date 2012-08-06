$(document).ready(function() {

	var activeClient;
	
	function attemptClientLogin(id)
	{
		$.ajax({
			url: '/client-login',
			type: "POST",
			data : { id : id },
			success: onClientLoginSuccess,
			error: function(jqXHR){ console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText); }
		});
	}
	
	function attemptClientLogout()
	{
		$.ajax({
			url: '/client-logout',
			type: "POST",
			success: onClientLogoutSuccess,
			error: function(jqXHR){ console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText); }
		});
	}	

	function onClientLoginSuccess(res)
	{
		activeClient = res;
		welcomeModal.find('.username').text(activeClient.fname+' '+activeClient.lname+'!');
		welcomeModal.modal('show');
		$('#btn-login').html("<i class='icon-lock icon-white'/>Log Out");
	}
	
	function onClientLogoutSuccess(res)
	{
		activeClient = null;
		goodbyeModal.modal('show');
		setTimeout(function(){
			goodbyeModal.modal('hide');
			$('#btn-login').html("<i class='icon-lock icon-white'/>Log In");
		}, 3000);
	}
	
	$('#btn-login').click(function(){
		if (activeClient){
			attemptClientLogout();
		}	else{
			attemptClientLogin('501f39f0230a6ffe0c000007');
		}
	});

	// Buttons for testing only. Safe to remove if you'd like.
		$('#btn-timeout').click(function(){ timeoutModal.modal('show'); });
		$('#btn-reservation-confirm').click(function(){ reservationConfirmModal.modal('show'); });
		$('#btn-reservation-success').click(function(){ reservationSuccessModal.modal('show'); });
		$('#btn-service-selection').click(function(){ serviceSelectionModal.modal('show'); });

		var welcomeModal = $('.modal-welcome');
		welcomeModal.modal({ show : false, keyboard : true, backdrop : true });
		
		var goodbyeModal = $('.modal-logout');
		goodbyeModal.modal({ show : false, keyboard : false, backdrop : 'static' });

		var timeoutModal = $('.modal-timeout');
		timeoutModal.modal({ show : false, keyboard : true, backdrop : true });

		var reservationConfirmModal = $('.modal-reservation-confirm');
		reservationConfirmModal.modal({ show : false, keyboard : true, backdrop : true });

		var reservationSuccessModal = $('.modal-reservation-success');
		reservationSuccessModal.modal({ show : false, keyboard : true, backdrop : true });
		
		var serviceSelectionModal = $('.modal-service-selection');
		serviceSelectionModal.modal({ show : false, keyboard : true, backdrop : true });
		
});