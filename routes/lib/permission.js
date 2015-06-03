/**
 * Controls all needed permissions
 */


// dependencies
var Post = require('../../models/Post');
var Thread = require('../../models/Thread');
var User = require('../../models/User');
var ACL = require('./acl');
var permission = {};

// check if a role is permitted to call a specifiy http method
permission.secureApi = function(req, res, next){
	var isPermitted = getAcl(req);
	if(isPermitted){
		next();
	} else {
		res.status(403).end('Error: No permission to access this route!');
	}
};


// helper function, interface to ACL
function getAcl(req){
	var role = getRole(req);
	console.log('permission.js - role: ', role);
	var method = req.method.toLowerCase();
	console.log('permission.js - method: ', method);
	var uri = getUri(req);
	console.log('permission.js - uri: ', uri);

	var isPermitted = ACL.isPermitted(role, method, uri);
	console.log('permission.js - isPermitted: ', isPermitted);
	return isPermitted;
}


function getRole(req){
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


// Check if a role is permitted to interact with a specifiy object
// note: only used for put and delete AND for get by id for messages
permission.check = function(req, res, next){
	if(req.user.role === 'admin'){
		next();
	} else {
		get_requested_object_id(req.params.id, function(id){
			if(id.equals(req.user._id)){
				next();
			} else if(req.user.role === 'moderator'){
				// avoid that a moderator can update or delete another moderator or admin
				role = get_requested_user_role(req.params.id, function(role){
					if(role){
						moderator_acces_key = ACL.get_access_key(req.user.role);
						role_editable_by = ACL.get_editable_by(role);
						if(role_editable_by % moderator_acces_key === 0){
							next();
						} else {
							res.status(403).end('Error: No permission to access this route!');
						}
					}
				});
			} else {
				res.status(403).end('Error: No permission to access this route!');
			}
		});
	}
};


function get_requested_object_id(id, callback){
	User.findById(id, function(err, user){
		if(user){
			callback(user._id);
		}
	});
	Post.findById(id, function(err, post){
		if(post){
			callback(post.createdBy);
		}
	});
	Thread.findById(id, function(err, thread){
		if(thread){
			callback(thread.createdBy);
		}
	});
};


function get_requested_user_role(id, callback){
	User.findById(id, function(err, user){
		if(err){
			callback(null);
		} else if(user){
			callback(user.role);
		} else {
			callback(null);
		}
	});
};


// avoid that unallowed attributes will be stored into the DB
permission.permitted_obj = function(req){
	var update_obj = {};
	var attributes = getAcl(req);
	attributes.forEach(function(attrib){
		if(req.body[attrib]){
			update_obj[attrib] = req.body[attrib];
		}
	});
	return update_obj;
}


module.exports = permission;
