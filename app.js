
/**
 * Node.js Bridge Server
 * Author :: Stephen Braitsch
 */

var http = require('http');
var express = require('express');
var nib = require('nib');
var stylus = require('stylus');
var bodyParser = require("body-parser");
var session = require('express-session');

var app = express();

var http = require('http').Server(app);
global.io = require('socket.io')(http);

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views',  './app/server/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	proxy: true,
	resave: true,
	saveUninitialized: true
}));
app.use(stylus.middleware({ 
	src: './app/public',
	compile: function compile(str, path)
	{
		return stylus(str)
			.set('filename', path)
			.set('compress', true)
			.use(nib());
	}
}));
app.use(express.static('./app/public'));

require('./app/server/routes')(app);

var server = app.listen(3000, function (req, res)
{
	console.log('Express app listening at', server.address().address, server.address().port)
});