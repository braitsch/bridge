
/**
 * Node.js Bridge Server
 * Author :: Stephen Braitsch
 */

var exp = require('express');
var app = exp.createServer();

global.host = 'localhost';
global.socket = require('socket.io').listen(app);
global.socket.set('log level', 1);
global.socket.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

app.root = __dirname;

require('./app/config')(app, exp);
require('./app/server/router')(app);

app.listen(8080, function(){
 	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});