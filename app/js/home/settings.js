
$(document).ready(function(){
	
	$('#delete').click(function(){	
	// todo - display confirm window prior to deletion //				
		$.ajax({
			url : '/delete',
			type : "POST",
			success: function(data){
				window.location.href = '/login';
			},
			error: function(jqXHR){
				console.log('error', jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	})
	
});