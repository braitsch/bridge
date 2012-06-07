
$(document).ready(function(){

	$('#btn-logout').click(function(){	
		$.ajax({
			url: '/logout',
			type: "POST",
			success: function(data){
		// todo - display modal window confirming logout //		
				window.location.href = '/login';
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	})
	
})