
/**
 * Node.js Bridge Server
 * Author :: Stephen Braitsch
 */

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var stylus = require('stylus');
var nib = require('nib');

global.host = 'localhost';
global.socket = require('socket.io').listen(server);
global.socket.set('log level', 1);
global.socket.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

function compile(str, path) 
{
	return stylus(str)
		.set('filename', path)
		.set('compress', true)
		.use(nib());
}

app.configure(function(){
	app.set('port', 8080);
	app.set('views', __dirname + '/app/server/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'super-duper-secret-secret' }));
	app.use(express.methodOverride());
	app.use(stylus.middleware({ 
		src: __dirname + '/app/public',
		compile: compile 
	}));
	app.use(express.static(__dirname + '/app/public'));
	app.use('/screens', express.static(__dirname + '/app/public/screens'));
	app.use('/screens', express.directory(__dirname + '/app/public/screens'));
	app.use(express.errorHandler());
});

require('./app/server/router')(app);

server.listen(app.get('port'), function(){
	console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});