
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
	
// global data object that describes the organization //
	ORG_DATA = JSON.parse($("#org").val())
	$('.brand').text(capitalize(ORG_DATA.name));

})