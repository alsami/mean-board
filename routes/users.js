var express = require('express');
var router = express.Router();


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
				if(bcrypt.compareSync(req.body.password, user.password)){
					user.password = '';
					req.session.user = user;
					res.header("Content-Type", "application/json; charset=utf-8");
					res.json(user).end();
				} else {
					res.status(400).end('Incorrect password');
				}
			} else {
				res.status(400).end('Error: Did not find a user for this username!');
			}
		});
});

// isLoggedIn? Check if there is a cookie
// if true return user
// else return error
router.get('/login', function(req, res, next){
	res.header("Content-Type", "application/json; charset=utf-8");
	if(req.user){
		res.json(req.user).end();
	} else {
		res.status(400).end('Status: Not logged in!');
	}
});

// logout:
router.get('/logout', function(req, res, next){
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
					res.status(201).json(user);
				}
			});
		}
	});
});


// update user by id
router.put('/byID/:id', function(req, res, next) {
	User.findByIdAndUpdate(req.params.id, req.body)
		.deepPopulate(
			'subscribed_categories' +
			' subscribed_threads'
		)
		.exec(function (err, user) {
			if (err) return next(err);
			res.header("Content-Type", "application/json; charset=utf-8");
			user.password = '';
			req.session.user = user;
			res.json(user).end();
		});
});


// soft delete user by setting current date for deletedAt
router.delete('/byID/:id', function(req, res, next) {
	User.findByIdAndUpdate(req.params.id, {deletedAt: Date.now()} , function (err, user) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		user.password = '';
		res.json(user);
	});
});


module.exports = router;
