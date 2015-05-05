var Post = require('../../models/Post');
var Thread = require('../../models/Thread');
var permission = {};


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
