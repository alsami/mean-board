var Post = require('../../models/Post');
var Thread = require('../../models/Thread');
var ACL = require('./acl');
var permission = {};


permission.secureApiWithAcl = function(req, res, next){
	var role = getRole(req);
	console.log('permission.js - role: ', role);
	var method = req.method.toLowerCase();
	console.log('permission.js - method: ', method);
	var model = getModel(req);
	console.log('permission.js - model: ', model);
	
	var isPermitted = ACL(role, method, model);
	console.log('permission.js - isPermitted: ', isPermitted);

	next();
};


function getRole(req){
	console.log('req.user: ', req.user);
	if(req.user){
		return req.user.role;
	} else {
		return 'guest';
	}
};


function getModel(req){
	root_model_id = req.url.split('/');
	model = root_model_id[1];
	return model;
};


permission.loginRequired = function(req, res, next){
	if(!req.user){
		res.status(403).end('Error: Please login!');
	} else {
		next();
	}
};


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
