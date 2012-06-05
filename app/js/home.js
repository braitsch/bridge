
$(document).ready(function(){
	
	$('#btn-logout').click(function(){	
		console.log('logging out')
	})	
	$('#skt-button').click(function(){
		socket.emit('bridge-event', { msg:'hello'});
	})	
	socket = io.connect();
})