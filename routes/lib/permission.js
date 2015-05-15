var Post = require('../../models/Post');
var Thread = require('../../models/Thread');
var User = require('../../models/User');
var ACL = require('./acl');
var permission = {};


permission.secureApi = function(req, res, next){
	var isPermitted = getAcl(req);
	if(isPermitted){
		next();
	} else {
		res.status(403).end('Error: No permission to access this route!');
	}
};


function getAcl(req){
	var role = getRole(req);
	console.log('permission.js - role: ', role);
	var method = req.method.toLowerCase();
	console.log('permission.js - method: ', method);
	var uri = getUri(req);
	console.log('permission.js - uri: ', uri);

	var isPermitted = ACL(role, method, uri);
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


permission.check = function(req, res, next){
	if(req.user.role === 'admin'){
		next();
	} else if(req.user.role === 'moderator' && req.url.indexOf('category') === -1){
		next();
	} else {
		get_requested_object(req.params.id, function(id){
			if(id.equals(req.user._id)){
				next();
			} else {
				res.status(403).end('Error: No permission to access this route!');
			}
		});
	}
};


function get_requested_object(id, callback){
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
