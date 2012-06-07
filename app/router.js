
var ST = require('./modules/us-state-list');
var AM = require('./modules/account-manager');

module.exports = function(app) {
	
	app.get('/', function(req, res){
		AM.getAllOrgs( function(e, orgs){
			if (e){
				res.send('eek! something went wrong', 400);
			}	else{
				res.render('index', {
					title: 'Welcome to SF-Bridge', orgs : orgs
				});
			}
		});
	});
	
// account login //
	
	app.get('/login', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.email == undefined || req.cookies.passw == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.email, req.cookies.passw, function(u){
				if (u == null){
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}	else{
					AM.getOrg(u.org, function(o){
					    req.session.org = o;
					    req.session.user = u;
						res.redirect('/control-panel');
					});
				}
			});
		}
	});
	
	app.post('/login', function(req, res){
	// attempt manual login //
		AM.manualLogin(req.param('email'), req.param('passw'), function(e, u){
			if (!u){
				res.send(e, 400);
			}	else{
				AM.getOrg(u.org, function(o){
				    req.session.org = o;
				    req.session.user = u;
					if (req.param('remember-me') == 'true'){
						res.cookie('email', u.email, { maxAge: 900000 });
						res.cookie('passw', u.passw, { maxAge: 900000 });
					}
					res.send(o, 200);
				});
			}
		});
	});
	
	app.post('/email-password', function(req, res){
		res.send('ok', 200);
		// AM.getEmail(req.param('email'), function(o){
		// 	if (o){
		// 		res.send('ok', 200);
		// 		EM.send(o, function(e, m){ console.log('error : '+e, 'msg : '+m)});	
		// 	}	else{
		// 		res.send('email-not-found', 400);
		// 	}
		// });
	})
		
// account creation //	
	
	app.get('/signup', function(req, res){
		res.render('signup/signup', { 
			title : 'Join SF-Bridge', states : ST 
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
		AM.getOrg(req.param('org-name'), function(o){
			if (o){
				res.send('org-name-taken', 400);				
			}	else{
				res.send('ok', 200);
			}
		});
	}
	
	function onSignupPage2(req, res)
	{
		AM.getUser(req.param('user-email'), function(o){
			if (o){
				res.send('email-taken', 400);
			}	else{
				AM.addOrg({
					name 	: req.param('org-name'),
					addy1 	: req.param('org-addy1'),
					addy2 	: req.param('org-addy2'),
					city	: req.param('org-city'),
					state 	: req.param('org-state'),
					phone	: req.param('org-phone'),
					website	: req.param('org-website')
				}, function(o){
					if (!o){
						res.send(e, 400);
					}	else{
						AM.addUser({
							org		: req.param('org-name'),
							name 	: req.param('user-name'),
							pos		: req.param('user-position'),
							phone 	: req.param('user-phone'),
							email	: req.param('user-email'),
							passw	: req.param('user-pass1'),
						}, function(u){
							if (!u){
								res.send(e, 400);
							}	else{
								req.session.org = o;								
								req.session.user = u;
								res.send('ok', 200);
							}
						});
					}
				});
			}
		});
	}
	
// control panel //	
	
	app.get('/control-panel', function(req, res) { 
	    if (req.session.user == null || req.session.org == null){
			res.redirect('/login');
		}	else{
			res.render('home/control-panel', { title : 'Control Panel', org:req.session.org, user:req.session.user });
		}
	});
	
	app.post('/control-panel', function(req, res) {
		AM.updateInventory(req.session.org.name, req.param('cat'), req.param('inv'), function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});	
	
// inventory //
	
	app.get('/control-panel/inventory', function(req, res){
	    if (req.session.user == null || req.session.org == null){
			res.redirect('/login');
		}	else{
			res.render('home/inventory', { title : 'Inventory', org:req.session.org, user:req.session.user } );
		}
	});
	
			// var inv = {
			// 	beds	:{ male	:[50, 100], female	:[50, 100], family:[50, 100], total:[150, 300] },
			// 	showers	:{ male	:[50, 100], female	:[50, 100], total:[100, 200] },
			// 	meals	:{ bfast:[50, 100], lunch	:[50, 100], dinner:[50, 100], total:[150, 300] }
			// };
			// AM.setInventory(req.session.org.name, inv, function(e){
			// 	if (e){
			// 		res.send(e, 400);
			// 	}	else{
			// 		res.render('home/inventory', { title : 'Inventory' } );
			// 	}
			// });	
	
	
// aux methods //	

	app.post('/logout', function(req, res) {
		console.log('logout')
		res.clearCookie('email');
		res.clearCookie('passw');
		req.session.destroy(function(e){ res.send('ok', 200); });
	});
	
	app.get('/print', function(req, res) {
		AM.getAllOrgs( function(e, orgs){
			AM.getAllUsers( function(e, users){
				res.render('print', { title : 'Accounts', orgs : orgs, users : users } );		
			})
		})
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords( );
		res.redirect('/print');
	});	

	app.get('*', function(req, res) { 
		res.render('404', { title: 'Page Not Found'});
	});

};