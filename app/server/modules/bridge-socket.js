

module.exports = function()
{
	
	var connections = { };
	
	io.on('connection', function(socket) {	
		socket.on('bridge-event', function(data) {
		// append this socket's id so we know who is talking //
			data.id = socket.id;
			socket.broadcast.emit('bridge-event', data);
		});

		function dispatchStatus()
		{
			brodcastMessage('status', connections);
		}
		
		function brodcastMessage(message, data)
		{
	//	remove socket.emit if you don't want the sender to receive their own message //
			socket.emit(message, data);
			socket.broadcast.emit(message, data);
		}
		
	// handle connections & disconnections //
		connections[socket.id] = {}; dispatchStatus();
		socket.on('disconnect', function() {
			delete connections[socket.id]; dispatchStatus();
		});

	});
}();