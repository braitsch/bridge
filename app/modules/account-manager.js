
var bcrypt = require('bcrypt')
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var dbPort = 27017;
var dbHost = global.host;
var dbName = 'sf-bridge';

// use moment.js for pretty date-stamping //
var moment = require('moment');

var AM = {}; 
	AM.db = new Db(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}, {}));
	AM.db.open(function(e, d){ console.log('connected to database :: ' + dbName)});
	AM.orgs = AM.db.collection('orgs');
	AM.usrs = AM.db.collection('usrs');	

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
			bcrypt.compare(p, o.passw, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('Invalid Password');				
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
	AM.saltAndHash(o.passw, function(hash){
		o.passw = hash;
		o.org = o.org.toLowerCase();		
		o.email = o.email.toLowerCase();
	// append date stamp when record was created //	
		o.date = moment().format('MMMM Do YYYY, h:mm:ss a');
		AM.usrs.insert(o, callback(o));
	});
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

AM.getAllOrgs = function(callback) 
{
	AM.orgs.find().toArray( function(e, res) { callback(e, res) });
};

AM.getAllUsers = function(callback) 
{
	AM.usrs.find().toArray( function(e, res) { callback(e, res) });
};

// password stuff //

AM.setPassword = function(oldp, newp, callback)
{
	AM.orgs.findOne({pass:oldp}, function(e, o){
		AM.saltAndHash(newp, function(hash){
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

AM.saltAndHash = function(pass, callback)
{
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(pass, salt, function(err, hash) {
			callback(hash);
	    });
	});
}

AM.deleteAccount = function(id, callback) 
{
	AM.orgs.remove({_id: this.getObjectId(id)}, callback);
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
		// overwrite //
			org.inv[index] = newCat;
		}
		AM.orgs.save(org); callback(org);
		// AM.getOrg(org.name, function(o){
		// 	console.log('----------------------------')
		// 	for (var i = o.inv.length - 1; i >= 0; i--){
		// 		var cat = o.inv[i];
		// 		console.log(cat.name+' :::::');
		// 		for (var k = cat.fields.length - 1; k >= 0; k--){
		// 			console.log(cat.fields[k].name, cat.fields[k].avail, cat.fields[k].total);
		// 		};
		// 	};
		// })		
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
	return AM.orgs.db.bson_serializer.ObjectID.createFromHexString(id)
}

AM.delAllRecords = function(id, callback) 
{
	AM.orgs.remove(); // reset orgs collection for testing //
	AM.usrs.remove(); // reset usrs collection for testing //	
}

