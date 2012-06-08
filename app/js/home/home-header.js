
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
	
//capitalize every word in organization name //
	var org = JSON.parse($("#org").val()).name;
	var cap = org.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	$('.brand').text(cap);

})