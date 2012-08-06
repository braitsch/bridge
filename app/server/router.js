
var BS = require('./modules/bridge-socket');
var ST = require('./modules/us-state-list');
var SV = require('./modules/all-services');
var AM = require('./modules/account-manager');

module.exports = function(app) {

// public dashboard //

	app.get('/', function(req, res){
		res.render('dashboard/select-services', { title: 'Welcome to SF-Bridge', cdata:req.session.client || null });
	});
	
	app.post('/client-login', function(req, res){
		AM.getClient(req.param('id'), function(e, o){
			if (e){
				res.send(e, 400);
			}	else{
				req.session.client = o;
				res.send(o, 200);
			}
		})
	});
	
	app.post('/client-logout', function(req, res){
		req.session.destroy(function(e){ res.send('ok', 200); });
	});

	app.post('/request-services', function(req, res){
		if (req.session.client == null){
			res.send('Not Logged In', 400);
		}	else{
			req.session.services = req.param('services');
			res.send('ok', 200);
		}
	});
	
	app.get('/request-provider', function(req, res){
		if (req.session.client == null){
			res.redirect('/');
		}	else{
			var k = req.session.client ? JSON.stringify(req.session.client) : null;
			res.render('dashboard/select-provider', { title: 'Welcome to SF-Bridge', cdata:req.session.client || null });
		}
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
						res.redirect('/offerings');
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
						res.cookie('email', u.email, { maxAge: 900000, path : '/login' });
						res.cookie('passw', u.passw, { maxAge: 900000, path : '/login' });
					}
					res.send(o, 200);
				});
			}
		});
	});
	
	app.post('/logout', function(req, res) {
		res.clearCookie('email', {path : '/login' });
		res.clearCookie('passw', {path : '/login' });
		req.session.destroy(function(e){ res.send('ok', 200); });
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
					inv		: [],
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
	
// logged in pages //
	
	app.get('/offerings', function(req, res){
	    if (req.session.user == null || req.session.org == null){
			res.redirect('/login');
		}	else{
			AM.getOrg(req.session.org.name, function(org){
				res.render('home/offerings', { title : 'Inventory',
					all_services:SV, our_services:org.inv,
					oName:req.session.org.name, uName:req.session.user.name
				});
			})
		}
	});
	
	app.post('/offerings', function(req, res){
		AM.setInventory(req.session.org.name, req.param('inv'), function(org){
			if (org){
				req.session.org = org;
				res.send('ok', 200);
			}	else{
				res.send('error updating offerings', 400);
			}
		});
	})

	app.get('/about-us', function(req, res){
	    if (req.session.user == null || req.session.org == null){
			res.redirect('/login');
		}	else{
			res.render('home/about-us', { title : 'About Us',
				org:req.session.org,
				oName:req.session.org.name, uName:req.session.user.name
			});
		}
	});

	app.get('/our-team', function(req, res){
	    if (req.session.user == null || req.session.org == null){
			res.redirect('/login');
		}	else{
			AM.getUsersOfOrg(req.session.org.name, function(e, users){
				res.render('home/our-team', { title : 'Our Team',
					team:users, 
					oName:req.session.org.name, uName:req.session.user.name
				});
			})
		}
	});
	
	app.get('/clients', function(req, res){
	    if (req.session.user == null || req.session.org == null){
			res.redirect('/login');
		}	else{
			AM.getAllClients(function(e, clients){
				res.render('home/clients', { title : 'Clients',
					clients:clients,
					oName:req.session.org.name, uName:req.session.user.name
				});
			});
		}
	});
	
// update / deletion requests //

	app.post('/delete-account', function(req, res) {
		AM.deleteAccount(req.session.user, req.session.org, function(){
			res.clearCookie('email', {path : '/login' });
			res.clearCookie('passw', {path : '/login' });
			req.session.destroy(function(e){ res.send('ok', 200); });
		})
	});
	
	app.post('/client-lookup', function(req, res) {
		AM.getClient(req.param('id'), function(o){
			if (e){
				res.send(e, 400);
			}	else{
				res.send(o, 200);
			}
		});
	});
	
	app.post('/client-add-new', function(req, res) {
		AM.addClient({
			fname 		: req.param('fname'),
			lname 		: req.param('lname'),
			gender 		: req.param('gender'),
			ethnicity 	: req.param('ethnicity'),
			birthMonth 	: req.param('birth-month'),
			birthDay 	: req.param('birth-day'),
			birthYear 	: req.param('birth-year'),
			social 		: req.param('social'),
			language 	: req.param('language'),
			heightFeet 	: req.param('height-feet'),
			heightInches: req.param('height-inches'),
			eyeColor 	: req.param('eye-color'),
			veteran 	: req.param('veteran'),
			disabled 	: req.param('disabled'),
			tuberculous : req.param('tuberculous'),
		}, function(clients){
			res.send(clients, 200);
		});
	});
	
	app.post('/client-edit', function(req, res) {
		AM.editClient({
			id			: req.param('id'),
			fname 		: req.param('fname'),
			lname 		: req.param('lname'),
			gender 		: req.param('gender'),
			ethnicity 	: req.param('ethnicity'),
			birthMonth 	: req.param('birth-month'),
			birthDay 	: req.param('birth-day'),
			birthYear 	: req.param('birth-year'),
			social 		: req.param('social'),
			language 	: req.param('language'),
			heightFeet 	: req.param('height-feet'),
			heightInches: req.param('height-inches'),
			eyeColor 	: req.param('eye-color'),
			veteran 	: req.param('veteran'),
			disabled 	: req.param('disabled'),
			tuberculous : req.param('tuberculous'),
		}, function(clients){
			res.send(clients, 200);
		});
	});

// aux methods //

	app.get('/print', function(req, res) {
		AM.getAllOrgs( function(e, orgs){
			AM.getAllUsers( function(e, users){
				AM.getAllClients( function(e, clients){
					res.render('aux/print', { title : 'Bridge Data', orgs : orgs, users : users, clients : clients } );
				})
			})
		})
	});
	
	app.get('/reset', function(req, res) {
		AM.addDummyData( ); res.redirect('/print');
	});
	
	app.get('/list', function(req, res){
		AM.getAllOrgs( function(e, orgs){
			if (e){
				res.send('Error retreiving provider list', 400);
			}	else{
				res.render('aux/list', { title: 'Welcome to SF-Bridge', orgs : orgs });
			}
		});
	});	

	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};