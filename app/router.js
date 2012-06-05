
var ST = require('./modules/us-state-list');
var AM = require('./modules/account-manager');

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
			onSignupPage1(req, res);
		}	else{
			onSignupPage2(req, res);
		}
	});	
	
	function onSignupPage1(req, res)
	{
		AM.checkOrgExists(req.param('org-name').toLowerCase(), function(o){
			if (!o){
				res.send('ok', 200);
			}	else{
				res.send('organization exists', 400);
			}
		});
	}
	
	function onSignupPage2(req, res)
	{
		var ul = req.param('user-login').toLowerCase();
		var ue = req.param('user-email').toLowerCase();
		AM.checkUserExists(ul, ue, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				AM.addOrg({
					name 	: req.param('org-name').toLowerCase(),
					addy1 	: req.param('org-addy1'),
					addy2 	: req.param('org-addy2'),
					city	: req.param('org-city'),
					state 	: req.param('org-state'),
					phone	: req.param('org-phone'),
					website	: req.param('org-website')
				}, function(e){
					if (e){
						res.send(e, 400);
					}	else{
						AM.addUser({
							org		: req.param('org-name'),
							name 	: req.param('user-name'),
							pos		: req.param('user-position'),
							phone 	: req.param('user-phone'),
							email	: req.param('user-email').toLowerCase(),
							login 	: req.param('user-login'),
							pass	: req.param('user-pass'),
							ukey	: req.param('user-login').toLowerCase()
						}, function(e){
							if (e){
								res.send(e, 400);
							}	else{
								res.send('ok', 200);
							}
						});
					}
				});
			}
		});
	}
	
	app.get('/print', function(req, res) {
		AM.getAllOrgs( function(e, orgs){
			AM.getAllUsers( function(e, users){
				res.render('print', { locals: { title : 'Accounts', orgs : orgs, users : users } });		
			})
		})
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords( );
		res.redirect('/print');
	});	

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