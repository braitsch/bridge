

var SM = require('./socket-manager');
	SM.init('bridge')

var onBridgeEvent = function(socket, data)
{
	console.log(onBridgeEvent, data);
// append this socket's id so we know who is talking //
	data.id = socket.id;
	socket.broadcast.emit('bridge-event', data);
}

SM.onConnect = function(socket)
{
	socket.on('bridge-event', function(data) { onBridgeEvent(socket, data); });	
}

SM.onDisconnect = function(socket)
{
//	console.log('socket '+socket.id+' disconnected----!!!');
}