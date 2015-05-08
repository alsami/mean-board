var acl = {
	guest: {
		user: {
			get: true,
			post: true,
			update: false,
			delete: false
		},
		category: {
			get: true,
			post: false,
			update: false,
			delete: false
		},
		thread: {
			get: true,
			post: false,
			update: false,
			delete: false
		},
		post: {
			get: true,
			post: false,
			update: false,
			delete: false
		}
	},
	user: {
		user: {
			get: true,
			post: false,
			update: true,
			delete: true
		},
		category: {
			get: true,
			post: false,
			update: false,
			delete: false
		},
		thread: {
			get: true,
			post: true,
			update: true,
			delete: false
		},
		post: {
			get: true,
			post: true,
			update: true,
			delete: false
		}
	},
	user: {
		user: {
			get: true,
			post: false,
			update: true,
			delete: true
		},
		category: {
			get: true,
			post: false,
			update: false,
			delete: false
		},
		thread: {
			get: true,
			post: true,
			update: true,
			delete: false
		},
		post: {
			get: true,
			post: true,
			update: true,
			delete: false
		}
	},
	moderator: {
		user: {
			get: true,
			post: false,
			update: true,
			delete: true
		},
		category: {
			get: true,
			post: false,
			update: false,
			delete: false
		},
		thread: {
			get: true,
			post: true,
			update: true,
			delete: true
		},
		post: {
			get: true,
			post: true,
			update: true,
			delete: true
		}
	},
	admin: {
		user: {
			get: true,
			post: true,
			update: true,
			delete: true
		},
		category: {
			get: true,
			post: true,
			update: true,
			delete: true
		},
		thread: {
			get: true,
			post: true,
			update: true,
			delete: true
		},
		post: {
			get: true,
			post: true,
			update: true,
			delete: true
		}
	}
};


var isPermitted = function(role, method, model){
	try {
		return acl[role][model][method];
	} catch(err) {
		console.log('ACL Error: ', err);
		return false;
	}
};


module.exports = isPermitted;
