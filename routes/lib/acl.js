var acl = {
	guest: {
		user: {
			get: true,
			post: true,
			put: false,
			delete: false
		},
		category: {
			get: true,
			post: false,
			put: false,
			delete: false
		},
		thread: {
			get: true,
			post: false,
			put: false,
			delete: false
		},
		post: {
			get: true,
			post: false,
			put: false,
			delete: false
		}
	},
	user: {
		user: {
			get: true,
			post: false,
			put: true,
			delete: true
		},
		category: {
			get: true,
			post: false,
			put: false,
			delete: false
		},
		thread: {
			get: true,
			post: true,
			put: true,
			delete: false
		},
		post: {
			get: true,
			post: true,
			put: true,
			delete: false
		}
	},
	moderator: {
		user: {
			get: true,
			post: false,
			put: true,
			delete: true
		},
		category: {
			get: true,
			post: false,
			put: false,
			delete: false
		},
		thread: {
			get: true,
			post: true,
			put: true,
			delete: true
		},
		post: {
			get: true,
			post: true,
			put: true,
			delete: true
		}
	},
	admin: {
		user: {
			get: true,
			post: true,
			put: true,
			delete: true
		},
		category: {
			get: true,
			post: true,
			put: true,
			delete: true
		},
		thread: {
			get: true,
			post: true,
			put: true,
			delete: true
		},
		post: {
			get: true,
			post: true,
			put: true,
			delete: true
		}
	}
};


var isPermitted = function(role, method, uri){
	try {
		return acl[role][uri][method];
	} catch(err) {
		console.log('ACL Error: ', err);
		return false;
	}
};


module.exports = isPermitted;