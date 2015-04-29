var permission = {};

permission.loginRequired = function(req, res, next){
	if(!req.user){
		res.status(403).end('Error: Please login!');
	} else {
		next();
	}
}

module.exports = permission;
