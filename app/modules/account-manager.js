
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

AM.autoLogin = function(user, pass, callback)
{
	AM.orgs.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

AM.manualLogin = function(user, pass, callback)
{
	AM.orgs.findOne({user:user}, function(e, o) {
		if (o == null){
			callback('User Not Found');
		}	else{
			bcrypt.compare(pass, o.pass, function(err, res) {
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
	AM.orgs.insert(o, callback(null));
}

AM.addUser = function(o, callback){
	AM.saltAndHash(o.pass, function(hash){
		o.pass = hash;
	// append date stamp when record was created //	
		o.date = moment().format('MMMM Do YYYY, h:mm:ss a');
		AM.usrs.insert(o, callback(null));
	});
}

AM.checkOrgExists = function(oname, callback)
{
	AM.orgs.findOne({name:oname}, function(e, o){ callback(o); });
}

AM.checkUserExists = function(ul, ue, callback)
{
	AM.usrs.findOne({ukey:ul}, function(e, o) {	
		if (o){
			callback('Username Taken');
		}	else{
			AM.usrs.findOne({email:ue}, function(e, o) {
				if (o){
					callback('Email Taken');
				}	else{
					callback( null );
				}
			});
		}
	});
}

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

AM.delete = function(id, callback) 
{
	AM.orgs.remove({_id: this.getObjectId(id)}, callback);
}

// print methods //

AM.getAllOrgs = function(callback) 
{
	AM.orgs.find().toArray( function(e, res) { callback(null, res) });
};

AM.getAllUsers = function(callback) 
{
	AM.usrs.find().toArray( function(e, res) { callback(null, res) });
};

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

