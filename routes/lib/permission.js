var Post = require('../../models/Post');
var Thread = require('../../models/Thread');
var ACL = require('./acl');
var permission = {};


permission.secureApiWithAcl = function(req, res, next){
	var role = getRole(req);
	console.log('permission.js - role: ', role);
	var method = req.method.toLowerCase();
	console.log('permission.js - method: ', method);
	var uri = getUri(req);
	console.log('permission.js - uri: ', uri);
	
	var isPermitted = ACL(role, method, uri);
	console.log('permission.js - isPermitted: ', isPermitted);

	if(isPermitted){	
		next();
	} else {
		res.status(403).end('Error: You do not have the permission to acces this route!');
	}
};


function getRole(req){
	console.log('req.user: ', req.user);
	if(!req.user){
		req.user = { role: 'guest'};
	}
	
	return req.user.role;
};


function getUri(req){
	root_model_id = req.url.split('/');
	uri = root_model_id[1];
	return uri;
};


// TODO:
// guest:
// * user: get
// * category: get
// * thread: get
// * post: get
//
// user:
// * user: get, update, delete
// * category: get
// * thread: get, post, update
// * post: get, post, update
//
// moderator:
// * user: get, update, delete
// * category: get
// * thread: get, post, update, delete
// * post: get, post, update, delete
//
// admin: 
// * user, category, thread, post: *

permission.hasPermissionToUpdate = function(req, res, next){
	if(!req.user){
		res.status(403).end('Error: Please login to access this route');
	} else {
		get_requested_object(req.params.id, function(obj){
			if(!obj){
				res.status(404).end('Error: Did not find requested object');
			} else if(obj.createdBy.equals(req.user._id)){
				next();
			} else {
				res.status(403).end('Error: This user do not have the permission to access this route.');
			}
		});
	}
};


function get_requested_object(id, callback){
	Post.findById(id, function(err, post){
		if(post){
			callback(post);
		} else {
			Thread.findById(id, function(err, thread){
				if(thread){
					callback(thread);
				} else {
					callback(null);
				}
			});
		}
	});
};


module.exports = permission;
