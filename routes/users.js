var express = require('express');
var router = express.Router();
var permission = require('./lib/permission');


/* import all needed Models */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var User = require('../models/User.js');


/* routes for user */


// get all users, but only return some information
router.get('/', function(req, res, next) {
	User.find()
		.select('firstName lastName birthday gender userName country')
		.exec(function (err, user) {
			if (err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			res.json(user);
	});
});


// get a specific user by id
router.get('/byID/:id', function(req, res, next){
	User.findById(req.params.id)
		.select('firstName lastName birthday gender userName country')
		.exec(function(err, user){
		if(err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});


// get a specific user by userName and password aka LOGIN
router.post('/login', function(req, res, next){
	User.findOne({userName: req.body.userName})
		.deepPopulate(
			'subscribed_categories' +
			' subscribed_threads'
		)
		.exec(function(err, user){
			if(err){
				return next(err);
			} else if(user){
				// check if user is banned aka soft-deleted
				if(user.deletedAt){
					res.status(400).end('Error: User is banned/deleted!');

				} else if(bcrypt.compareSync(req.body.password, user.password)){
					user.password = '';
					req.session.user = user;
					res.header("Content-Type", "application/json; charset=utf-8");
					res.json(user).end();

				} else {
					res.status(400).end('Error: Incorrect password');
				}
			} else {
				res.status(400).end('Error: Did not find a user for this username!');
			}
		});
});

// isLoggedIn? Check if there is a cookie and if role is not guest
// if true return user
// else return error
router.get('/login', function(req, res, next){
	res.header("Content-Type", "application/json; charset=utf-8");
	if(req.user && req.user.role !== 'guest'){
		res.json(req.user).end();
	} else {
		res.status(400).end('Status: Not logged in!');
	}
});

// logout:
router.get('/logout', function(req, res, next){
	req.user = null;
	req.session.reset();
	res.status(200).end('Successfully logged out!');
});


// create a user aka REGISTER
router.post('/', function(req, res, next) {
	User.findOne({userName: req.body.userName}, function(err, user){
		if(err){
			return next(err);
		} else if(user){
			res.status(400).end('Error: Username is already taken!');
		} else {
			var newUser = req.body;
			var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
			newUser.password = hash; // avoid saving password as plain text
			User.create(newUser, function(err, user){
				if(err){
					return next(err);
				} else {
					user.password = '';
					res.header("Content-Type", "application/json; charset=utf-8");
					req.session.user = user;
					res.status(201).json(user);
				}
			});
		}
	});
});


// update user by id
router.put('/byID/:id', permission.check, function(req, res, next) {
	req.body.updatedBy = req.user._id;
	req.body.updatedAt = Date.now();
	User.findByIdAndUpdate(req.params.id, req.body)
		.deepPopulate(
			'subscribed_categories' +
			' subscribed_threads'
		)
		.exec(function (err, user) {
			if (err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			user.password = '';
			
			// check if the updated user is the user logged in
			// true: add the changes to the cookie
			// false: stay with the current user
			if(user._id.equals(req.user._id)){
				req.session.user = user;
			}

			res.json(user).end();
		});
});


// soft delete user by setting current date for deletedAt
router.delete('/byID/:id', permission.check, function(req, res, next) {
	delete_info = {
		deletedAt: Date.now(),
		updatedBy: req.user._id
	};

	User.findByIdAndUpdate(req.params.id, delete_info, function (err, user) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");

		// check if user deleted him-/herself
		// true: logout
		// false: stay with current user
		if(user._id.equals(req.user._id)){
			req.session.reset();
			req.user = null;
		} else {
			user.password = '';
			res.json(user);
		}
	});
});


module.exports = router;
