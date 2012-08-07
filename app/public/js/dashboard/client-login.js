$(document).ready(function() {

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
		var n = activeClient.fname+' '+activeClient.lname;
		$('#client-name').text('Welcome, '+n);
		welcomeModal.find('.username').text(n+'!');
		welcomeModal.modal('show');
		$('#btn-login').html("<i class='icon-lock icon-white'/>Log Out");
		$.pubsub('publish', 'login.complete');
	}
	
	function onClientLogoutSuccess(res)
	{
		activeClient = null;
		goodbyeModal.modal('show');
		$.pubsub('publish', 'logout.complete');
		setTimeout(function(){
			if (window.location.pathname != '/'){
				window.location.href = '/';
			}	else{
				$('#client-name').text('');
				goodbyeModal.modal('hide');
				$('#btn-login').html("<i class='icon-lock icon-white'/>Log In");
			}
		}, 3000);
	}
	
	$('#btn-login').click(function(){
		if (activeClient){
			attemptClientLogout();
		}	else{
			attemptClientLogin('501f65791bc66f560e000006');
		}
	});
	
	var welcomeModal = $('.modal-welcome');
	welcomeModal.modal({ show : false, keyboard : true, backdrop : true });

	var goodbyeModal = $('.modal-logout');
	goodbyeModal.modal({ show : false, keyboard : false, backdrop : 'static' });

	if (!activeClient){
		$('#client-name').text('');
		$('#btn-login').html("<i class='icon-lock icon-white'/>Log In");
	}	else{
		$('#client-name').text('Welcome, '+activeClient.fname+' '+activeClient.lname);
		$('#btn-login').html("<i class='icon-lock icon-white'/>Log Out");
	}

});