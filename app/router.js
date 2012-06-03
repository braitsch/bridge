

module.exports = function(app) {
	
	app.get('/', function(req, res){
		res.render('index', { 
			locals: {
				title: 'Hello - Welcome to SF-Bridge',
			}
		});
	});

	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};