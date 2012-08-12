$(document).ready(function() {

	$('.button-back').on('click', function(){ window.location.href = '/'});
	$('#btn-login').html("<i class='icon-lock icon-white'/>Log Out");
	$('.button-reserve').on('click', function(event) {
		console.log(event);
	});
});