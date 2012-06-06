
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
	
// account login //	
	
	app.get('/login', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('account/login', { locals: { title: 'Hello - Please Login To Your Account' }});
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('account/home');
				}	else{
					res.render('account/login', { locals: { title: 'Hello - Please Login To Your Account' }});
				}
			});
		}
	});
	
	app.post('/login', function(req, res){
		if (req.param('email') != null){
			AM.getEmail(req.param('email'), function(o){
				if (o){
					res.send('ok', 200);
					EM.send(o, function(e, m){ console.log('error : '+e, 'msg : '+m)});	
				}	else{
					res.send('email-not-found', 400);
				}
			});
		}	else{
		// attempt manual login //
			AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
				if (!o){
					res.send(e, 400);
				}	else{
				    req.session.user = o;
					if (req.param('remember-me') == 'true'){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });
					}			
					res.send(o, 200);
				}
			});
		}
	});	
		
// account creation //	
	
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
		AM.getOrg(req.param('org-name').toLowerCase(), function(o){
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
	
	app.get('/inv', function(req, res){
	// test data model //	
		var inv = {
			beds	:{ male	:[50, 100], female	:[50, 100], family:[50, 100], total:[150, 300] },
			showers	:{ male	:[50, 100], female	:[50, 100], total:[100, 200] },
			meals	:{ bfast:[50, 100], lunch	:[50, 100], dinner:[50, 100], total:[150, 300] }
		};
		AM.setInventory('glide memorial', inv, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});
	
// aux methods //	
	
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
		var s = req.url.substring(1);
		s = s.replace('-', ' ');
// parse url and attempt to redirect to control panel if user is logged in //			
		AM.getOrg(s, function(org){
			if (org == null){
				res.render('404', { title: 'Page Not Found'});
			}	else{
				res.render('account/home', { locals: { title : 'Control Panel', org:org} });
			}
		})
	});
	
	app.post('*', function(req, res) { 
		var org = req.url.substring(1);
			org = org.replace('-', ' ');
		AM.updateInventory(org, req.param('cat'), req.param('inv'), function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});	

};