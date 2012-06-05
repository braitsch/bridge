
$(document).ready(function() {
	initSocket();
});

function initSocket()
{
	console.log('socket-initializing')
	socket = io.connect();
	socket.on('bridge-status', function (data) {
		var c = data.connections;
		var i=0; for (p in c) i++;
		var s = i > 1 ? ' are '+i+' People ' : ' is '+i+' Person ';
		$('#connection-count').html('There '+s+' Currently Connected');
	});
	socket.on('bridge-event', function (data) {
		console.log('bridge-event received', data);
	});
}