
module.exports = function(app, exp) {

	var stylus = require('stylus'),
		nib = require('nib');

	function compile(str, path) {
		return stylus(str)
			.set('filename', path)
    		.set('compress', true)
    		.use(nib());
	}

	app.configure(function(){
		app.set('views', app.root + '/app/server/views');
		app.set('view engine', 'jade');
		app.set('view options', { doctype : 'html', pretty : true });
		app.use(exp.bodyParser());
		app.use(exp.cookieParser());
		app.use(exp.session({ secret: 'super-duper-secret-secret' }));
		app.use(exp.methodOverride());
		app.use(stylus.middleware({ 
			src: app.root + '/app/public',
			compile: compile 
		}));
		app.use(exp.static(app.root + '/app/server'));
		app.use(exp.static(app.root + '/app/public'));
		app.use('/screens', exp.static(app.root + '/app/public/screens'));
		app.use('/screens', exp.directory(app.root + '/app/public/screens'));
		app.use(exp.errorHandler());
	});
}