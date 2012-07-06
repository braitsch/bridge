
$(document).ready(function(){
	
	$('#clients form input').focus();
	$('#clients form #search').click(function()
	{
		return false;
	})
	$('#clients form #register').click(function()
	{
		return false;
	})

	function hasGetUserMedia() {
		return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	}
	
//	console.log(hasGetUserMedia());
	
});