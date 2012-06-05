
var ST = require('./modules/us-state-list');

module.exports = function(app) {
	
	app.get('/', function(req, res){
		console.log('home')
		res.render('index', { 
			locals: {
				title: 'Hello - Welcome to SF-Bridge',
			}
		});
	});
	
	app.get('/signup', function(req, res){
		res.render('signup/signup', { 
			locals: {
				title : 'Join SF-Bridge', states : ST 
			}
		});
	});

	app.post('/signup', function(req, res){
		if (req.param('page') == 1){
			validateSignupPage1(req, res);
		}	else{
			validateSignupPage2(req, res);
		}
	});	
	
	function validateSignupPage1(req, res)
	{
		var o = req.param('org-name')
		console.log('orgName = '+o)
		res.send('ok', 200);
	}
	
	function validateSignupPage2(req, res)
	{
		console.log('v2')
		res.send('ok', 200);				
	}	

	app.get('*', function(req, res) { 
		var accountName = req.url.substring(1);
		// look up accountName in database
			// if found check cookie for login credentials
				// if they validate, render accountHome page and set session id.
			// if not found redirect to 404	
	//	console.log('accountName = '+accountName);
		res.render('404', { title: 'Page Not Found'}); 
	});

};