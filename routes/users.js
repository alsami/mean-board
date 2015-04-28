var express = require('express');
var router = express.Router();


/* import all needed Models */
var mongoose = require('mongoose');
var User = require('../models/User.js');


/* routes for user */

// login: aka get a specific user by userName and password
router.post('/login', function(req, res, next){
	User.findOne({userName: req.body.userName}, function(err, user){
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

// logout:
router.get('/logout', function(req, res, next){
	req.session.reset();
	res.status(200).end('Successfully logged out!');
});

// get all users
router.get('/', function(req, res, next) {
	User.find(function (err, user) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});

// get a specific user by id
router.get('/:id', function(req, res, next){
	User.findById(req.params.id, function(err, user){
		if(err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});

// create a user
router.post('/', function(req, res, next) {
	User.create(req.body, function (err, user) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});

// update user by id
router.put('/:id', function(req, res, next) {
	User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});

// soft delete user by setting current date for deletedAt
router.delete('/:id', function(req, res, next) {
	User.findByIdAndUpdate(req.params.id, {deletedAt: Date.now()} , function (err, user) {
		if (err) return next(err);
		res.header("Content-Type", "application/json; charset=utf-8");
		res.json(user);
	});
});

module.exports = router;
