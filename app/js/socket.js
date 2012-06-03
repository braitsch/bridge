
var socket;

$(document).ready(function() {
	initSocket();
	$('#test').click(function(){
		console.log(socket);
		socket.emit('bridge-event', { msg:'hello'});
	})
});

function initSocket()
{
	console.log('socket-initializing')
	socket = io.connect();
	socket.on('bridge-status', function (data) {
		var c = data.connections;
		var i=0; for (p in c) i++;
		var s = i > 1 ? ' are '+i+' People ' : ' is '+i+' Person ';
		$('#cnt').html('There '+s+' Currently Connected');
	});
	socket.on('bridge-event', function (data) {
		console.log('bridge-event received');
	});
}
