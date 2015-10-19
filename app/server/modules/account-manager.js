
var crypto		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server		= require('mongodb').Server;
var moment		= require('moment');

var dbName = process.env.DB_NAME || 'bridge';
var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;

var dummies = require('./dummy-data');

var AM = {}; 
	AM.db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	AM.db.open(function(e, d){
		if (e) {
			console.log(e);
		}	else{
			console.log('connected to database :: ' + dbName);
		}
	});
	AM.orgs = AM.db.collection('orgs');
	AM.usrs = AM.db.collection('usrs');
	AM.resv = AM.db.collection('resv');
	AM.clients = AM.db.collection('clients');

module.exports = AM;

// logging in //

AM.autoLogin = function(e, p, callback)
{
	AM.usrs.findOne({email:e}, function(e, o) {
		if (!o){
			callback(null);
		}	else{
			o.passw == p ? callback(o) : callback(null);
		}
	});
}

AM.manualLogin = function(e, p, callback)
{
	AM.usrs.findOne({email:e}, function(e, o) {
		if (!o){
			callback('User Not Found');
		}	else{
			validatePassword(p, o.passw, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

// insertion methods //

AM.addOrg = function(o, callback){
	o.date = moment().format('MMMM Do YYYY, h:mm:ss a');
	o.name = o.name.toLowerCase();
	AM.orgs.insert(o, callback(o));
}

AM.addUser = function(o, callback){
	saltAndHash(o.passw, function(hash){
		o.passw = hash;
		o.org = o.org.toLowerCase();
		o.email = o.email.toLowerCase();
		o.gravatar = md5(o.email);
	// append date stamp when record was created //
		o.created = o.edited = moment().format('MMMM Do YYYY, h:mm:ss a');
		AM.usrs.insert(o, callback(o));
	});
}
AM.addClient = function(o, callback){
	o.fname = o.fname.toLowerCase();
	o.lname = o.lname.toLowerCase();
	o.created = o.edited = moment().format('MMMM Do YYYY, h:mm:ss a');
	AM.clients.insert(o, function(){
		AM.getAllClients(function(e, a){ callback(a); });
	});
}
AM.editClient = function(o, callback){
	o._id = AM.getObjectId(o.id)
	o.edited = moment().format('MMMM Do YYYY, h:mm:ss a');
	o.fname = o.fname.toLowerCase();
	o.lname = o.lname.toLowerCase();
	AM.clients.save(o, function(){
		AM.getAllClients(function(e, a){ callback(a); });
	});
}
AM.addReservation = function(reservation, callback)
{
	AM.resv.insert(reservation, callback);
}

// dummy data for testing purposes //

var indexOrg, indexUser, indexClient;
AM.reset = function(callback)
{
// reset all collections for testing //
	AM.orgs.remove({}, function(){
		AM.usrs.remove({}, function(){
			AM.resv.remove({}, function(){
				AM.clients.remove({}, function(){
					indexOrg = indexUser = indexClient = 0;
					addDummyData(callback);
				})
			});
		});
	});
}

var addDummyData = function(callback)
{
	if (indexOrg < dummies.orgs.length){
		var o = dummies.orgs[indexOrg++];
			o.date = moment().format('MMMM Do YYYY, h:mm:ss a');
			o.name = o.name.toLowerCase();
		AM.orgs.insert(o, function(e, o){
			if (!e) {
				addDummyData(callback);
			}	else{
				console.log('*error @ AM.orgs.insert*');
			}
		});
	}	else if (indexClient < dummies.clients.length){
		var o = dummies.clients[indexClient++];
			o.date = moment().format('MMMM Do YYYY, h:mm:ss a');
		AM.clients.insert(o, function(e, o){
			if (!e) {
				addDummyData(callback);
			}	else{
				console.log('*error @ AM.clients.insert*');
			}
		});
	}	else if (indexUser < dummies.usrs.length){
		var o = dummies.usrs[indexUser++];
		saltAndHash(o.passw, function(hash){
			o.passw = hash;
			o.org = o.org.toLowerCase();
			o.email = o.email.toLowerCase();
			o.gravatar = md5(o.email);
		// append date stamp when record was created //
			o.date = moment().format('MMMM Do YYYY, h:mm:ss a');
			AM.usrs.insert(o, function(e, o){
				if (!e) {
					addDummyData(callback);
				}	else{
					console.log('*error @ AM.usrs.insert*');
				}
			});
		});
	} else{
		console.log('** database reset **');
		callback();
	}
}

// retrieval methods //

AM.getOrg = function(orgName, callback)
{
	orgName = orgName.toLowerCase();
	AM.orgs.findOne({name:orgName}, function(e, o){ callback(o); });
}
AM.getUser = function(usrEmail, callback)
{
	usrEmail = usrEmail.toLowerCase();
	AM.usrs.findOne({email:usrEmail}, function(e, o){ callback(o); });
}
AM.getClient = function(id, callback)
{
	AM.clients.findOne({_id:AM.getObjectId(id)}, callback);
}
AM.getClientByName = function(obj, callback)
{
	AM.clients.findOne(obj, callback);
}
AM.getAllOrgs = function(callback)
{
	AM.orgs.find().toArray( function(e, res) { callback(e, res) });
}
AM.getOrgsWithServices = function(services, callback)
{
	var a = [];
	for (var i = services.length - 1; i >= 0; i--) a.push({'inv.name':services[i].cat});
	AM.orgs.find({ $and: a }).toArray( function(e, res) {
	// iterate over matched providers //
		var i = 0; while(i < res.length){
	//	for (var i = res.length - 1; i >= 0; i--){
			for (var j = res[i].inv.length - 1; j >= 0; j--){
				var c = res[i].inv[j]; // service category //
				for (var k = services.length - 1; k >= 0; k--){
					var s = services[k];
					if (c.name == s.cat) {
		//				console.log(c.name, 'matched');
						var hasField = false;
						for (var m = c.fields.length - 1; m >= 0; m--){
							if (c.fields[m].name == s.sub) {
								var f = c.fields[m];
								hasField = true; break;
		//						console.log(f.name, 'matched', f.avail, f.total);
							}
						};
						if (!hasField) res[i].invalid = true;
					}
				};
			};
			res[i].invalid ? res.splice(i, 1) : i++;
		};
		callback(res);
	});
}
AM.getAllUsers = function(callback)
{
	AM.usrs.find().toArray( function(e, res) { callback(e, res) });
}
AM.getAllClients = function(callback)
{
	AM.clients.find().toArray( function(e, res) { callback(e, res) });
}
AM.getUsersOfOrg = function(orgName, callback)
{
	AM.usrs.find({ org:orgName }).toArray( function(e, res) { callback(e, res) });
}
AM.getAllReservations = function(callback)
{
	AM.resv.find().sort({date : -1}).toArray( function(e, res) {
		if (res.length == 0) {
			callback(e, res);
		}	else{
			var c = 0;
			for (var i = res.length - 1; i >= 0; i--){
				res[i].date = moment(res[i].date).format('MMMM Do YYYY, h:mm:ss a');
				AM.getClient(res[i].client, function(e, o){
					res[c++].client = o.fname + ' ' + o.lname;
					if (c == res.length) callback(e, res);
				})
			};
		}
	});
}

// password stuff //

AM.setPassword = function(oldp, newp, callback)
{
	AM.orgs.findOne({pass:oldp}, function(e, o){
		saltAndHash(newp, function(hash){
			o.pass = hash;
			AM.orgs.save(o); callback(o);
		});
	});
}

AM.validateLink = function(pid, callback)
{
	AM.orgs.findOne({pass:pid}, function(e, o){
		callback(o ? 'ok' : null);
	});
}

AM.deleteAccount = function(user, org, callback)
{
	AM.usrs.remove({_id: AM.getObjectId(user._id)}, function(){
		console.log('deleted user :', user.name);
		AM.orgs.remove({_id: AM.getObjectId(org._id)}, function(){
			console.log('deleted org :', org.name);
			callback();
		});
	});
}

// inventory //

AM.setInventory = function(orgName, newCat, callback)
{
	AM.getOrg(orgName, function(org){
		var index;
		for (var i = org.inv.length - 1; i >= 0; i--) if (org.inv[i].name == newCat.name) index = i;
		if (index == null){
			org.inv.push(newCat);
		}	else{
			if (newCat.total > 0){
			// overwrite //
				org.inv[index] = newCat;
			}	else{
			// remove category from inventory array //
				for (var i = org.inv.length - 1; i >= 0; i--) if (org.inv[i].name == newCat.name) org.inv.splice(i, 1);
			}
		}
		AM.orgs.save(org, function(e, o){
			if (!e){
				callback(org);
			}	else{
				console.log('*error @ AM.orgs.save*');
			}
		});
	})
}

AM.getInventoryCategory = function(org, cat)
{
	for (var i = org.inv.length - 1; i >= 0; i--) if (org.inv[i].name == cat.name) return org.inv[i];
}

// auxiliary methods //

AM.getEmail = function(email, callback)
{
	AM.orgs.findOne({email:email}, function(e, o){ callback(o); });
}

AM.getObjectId = function(id)
{
// this is necessary for id lookups, just passing the id fails for some reason //
	return AM.db.bson_serializer.ObjectID.createFromHexString(id)
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str)
{
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}
