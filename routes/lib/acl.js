/**
 * Access Control List (ACL)
 * Specify each role (guest, user, moderator, admin)
 * and its permissions.
 *
 * access_key and editable_by have to be prime numbers
 * except for role guest. The numbers are used to controll
 * the permission between the roles.
 *
 * Structure:
 * role : { 
 * 		access_key: prime number,
 * 		editable_by: prime_number,
 * 		object_to_interact_with: {
 * 			http_method: {
 * 				boolean or list of allowed attributes
 * 			}
 * 		}
 * }
 */

var acl = {
	guest: {
		access_key: -1,
		editable_by: -1,
		user: {
			get: true,
			post: [
				'firstName',
				'lastName',
				'userName',
				'email',
				'password'
			],
			put: false,
			delete: false,
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
		},
		message: {
			get: false,
			post: false,
			put: false,
			delete: false
		}
	},
	user: {
		access_key: 5,
		editable_by: 30, // 2*3*5 (admin * moderator * user)
		user: {
			get: true,
			post: false,
			put: [
				'firstName',
				'lastName',
				'birthday',
				'gender',
				'email',
				'signature',
				'aboutMe',
				'country',
				'city',
				'zipCode',
				'subscribed_categories',
				'subscribed_threads'
			],
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
			post: ['body'],
			put: ['body'],
			delete: false
		},
		message: {
			get: true,
			post: [
				'to',
				'subject',
				'body'
			],
			put: ['isRead'],
			delete: true
		}
	},
	moderator: {
		access_key: 3,
		editable_by: 2,
		user: {
			get: true,
			post: false,
			put: [
				'firstName',
				'lastName',
				'birthday',
				'gender',
				'email',
				'signature',
				'aboutMe',
				'country',
				'city',
				'zipCode',
				'subscribed_categories',
				'subscribed_threads'
			],
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
			post: ['body'],
			put: ['body'],
			delete: true
		},
		message: {
			get: true,
			post: [
				'to',
				'subject',
				'body'
			],
			put: ['isRead'],
			delete: true
		}
	},
	admin: {
		access_key: 2,
		editable_by: 2,
		user: {
			get: true,
			post: true,
			put: [
				'firstName',
				'lastName',
				'birthday',
				'gender',
				'email',
				'signature',
				'aboutMe',
				'country',
				'city',
				'zipCode',
				'subscribed_categories',
				'subscribed_threads',
				'role'
			],
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
			post: ['body'],
			put: ['body'],
			delete: true
		},
		message: {
			get: true,
			post: [
				'to',
				'subject',
				'body'
			],
			put: ['isRead'],
			delete: true
		}
	}
};


// uppercase ACL object provides logic
// and closure for acl list
var ACL = {};

// check if role is permittet
ACL.isPermitted = function(role, method, uri){
	try {
		return acl[role][uri][method];
	} catch(err) {
		console.log('ACL Error: ', err);
		return false;
	}
};


ACL.get_access_key = function(role){
	return acl[role]['access_key'];
};


ACL.get_editable_by = function(role){
	return acl[role]['editable_by'];
};


module.exports = ACL;
